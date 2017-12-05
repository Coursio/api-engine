'use strict';

const { addErrorHandler, normalizeError, rethrowError } = require('../error');
const { promiseThen } = require('../utilities');

const { addLogVars } = require('./vars');
const { reportLog } = require('./report');

// Log some event, including printing to console
const logEvent = function ({
  schema,
  mInput = { schema },
  vars,
  duration,
  type,
  ...rest
}) {
  const varsA = addLogVars({ vars, type, ...rest });

  const promise = reportLog({ schema, mInput, vars: varsA, duration });

  // We want to make sure this function does not return anything
  const promiseA = promiseThen(promise, () => undefined);
  return promiseA;
};

const logEventHandler = function (errorObj, { schema, type }) {
  const error = normalizeError({ error: errorObj, reason: 'LOG_ERROR' });
  const vars = { error };
  // Give up if error handler fails
  // I.e. we do not need to `await` this
  silentLogEvent({ type: 'failure', phase: 'process', schema, vars });

  // Failure events are at the top of code stacks. They should not throw.
  if (type === 'failure') { return; }

  rethrowError(errorObj);
};

const eLogEvent = addErrorHandler(logEvent, logEventHandler);

const silentLogEvent = addErrorHandler(logEvent);

module.exports = {
  logEvent: eLogEvent,
};
