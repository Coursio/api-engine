'use strict';


const { cloneDeep } = require('lodash');

const { deepMerge, buffer } = require('../utilities');
const { EngineError } = require('../error');
const { getServerInfo } = require('../info');
const { report } = require('./report');
const { getRequestInfo } = require('./request_info');
const { getRequestMessage } = require('./request_message');
const { LEVELS } = require('./constants');


// Represents a logger
// Can:
//  - new Log({ opts, phase }) - opts are server options
//  - log.info|log|warn|error(message, [logObj]) - sends some log
//  - log.add(object) - add requestInfo information
// There are different instances of loggers represented by the `phase`:
//  - startup, shutdown: during startup, shutdown
//  - request: one instance is created for each request
//  - process: anything that is process-related, e.g. unhandled rejected
//    promises
// Each instance can fire different types of logs.
//  - message (default): generic message
//  - start: the server is ready
//  - stop: the server has exited
//  - failure: an error occured, which should be looked into
//  - call: a request has completed, i.e. a response was sent back to the
//    client (with success or not)
// Each log type has an associated `logObj`, i.e. structured log information
// besides the error message and stack trace:
//  - message, start, call: none
//  - failure: `errorInfo`, containing a standard error
//  - stop: `exitStatuses`, showing which server has successfully exited or
//    not, e.g. { HTTP: false, ... }
// Each log has a level among: info, log, warn, error.
// Each logs fires the server option logger(info):
//  - `logger` is a server option, i.e. user-supplied
//  - `info` is:
//     - timestamp {string}
//     - type {string} - message|start|stop|failure|call
//     - level {string} - info|log|warn|error
//     - message {string} - what's printed on console (see below)
//     - messages.LEVEL {string[]} - all the logs with type `message` that have
//       been produced by this Log instance so far.
//       Not if current log type is `message`.
//     - requestInfo {object}
//         - request-specific information
//         - only if the current phase is `request`:
//         - built by calling `log.add(object)`, which is deep merged
//         - is automatically filtered (see `request_info.js` file) to avoid
//           the log to be too big, or leak security information
//     - loggerErrors {string[]} - when logging fails, it is retried with
//       an exponential delay, and this property is set with the error messages.
//     - serverInfo {object} - server or host-specific information
//         - system {object}:
//            - hostname {string}
//            - osType {string} - e.g. 'Linux'
//            - platform {string} - e.g. 'linux'
//            - release {string} - e.g. '4.8.0-52-generic'
//            - arch {string} - e.g. 'x64'
//         - stats {object}
//            - memory {number} - total memory in bytes
//            - cpus {number} - number of CPUs
//            - uptime {number} - how long the server has been running, in secs
//         - node {object}
//            - version {string} - e.g. 'v8.0.0'
//         - apiEngine {object}
//            - version {string} - e.g. '0.0.1'
//         - serverId {UUID} - specific to a given process
//         - serverName {UUID} - specific to a given machine.
//           Uses (if defined) the environment variable API_ENGINE_SERVER_NAME,
//           or otherwise the system hostname, or empty string if not available.
// A textual summary is also printed on the console:
//  - colorized, unless `node --no-color` or terminal does not support colors
//  - will be filtered according to server option `loggerLevel`:
//    info (default), log, warn, error, silent
//  - console messages are meant as a quick development-time helper.
//    Structured logs, using the server option `logger`, are the correct way to
//    store logs for monitoring.
// Note that any exception thrown in this module might not be logged
// (since this is the logger itself), so we must be precautious.
class Log {

  constructor({ opts: { logger, loggerLevel, loggerFilter }, phase }) {
    this._info = {};
    this._messages = {};

    this._report = buffer(this._report, this);

    for (const level of LEVELS) {
      this[level] = this._report.bind(this, level);
      this._messages[level] = [];
    }

    Object.assign(this, { logger, loggerLevel, loggerFilter, phase });
  }

  add(obj) {
    this._info = deepMerge(this._info, obj);
  }

  _report(level, rawMessage = '', logObj = {}){
    if (typeof rawMessage !== 'string') {
      const message = `Message must be a string: '${rawMessage}'`;
      throw new EngineError(message, { reason: 'UTILITY_ERROR' });
    }
    if (logObj == null || logObj.constructor !== Object) {
      const strObj = JSON.stringify(logObj);
      const message = `Log object must be an object: '${strObj}'`;
      throw new EngineError(message, { reason: 'UTILITY_ERROR' });
    }

    const phase = this.phase;
    const type = logObj.type || 'message';
    Object.assign(logObj, { phase, type });

    if (phase === 'request') {
      logObj.requestInfo = getRequestInfo(this._info, this.loggerFilter);
      if (type === 'call') {
        rawMessage = getRequestMessage(logObj.requestInfo);
      }
    }

    if (type === 'message') {
      this._messages[level].push(rawMessage);
    }

    if (includeMessagesTypes.includes(type)) {
      logObj.messages = cloneDeep(this._messages);
    }

    logObj.serverInfo = getServerInfo();

    report(this.logger, this.loggerLevel, level, rawMessage, logObj);
  }

  // Buffer log calls
  // E.g. used in requests when requestInfo is not completely built yet
  _setBuffered(isBuffered) {
    const method = isBuffered ? 'cork' : 'uncork';
    this._report[method]();
  }

}

const includeMessagesTypes = ['start', 'call', 'failure', 'stop'];


module.exports = {
  Log,
};
