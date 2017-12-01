'use strict';

const { reduceAsync } = require('../../utilities');
const { monitor } = require('../../perf');
const { protocolHandlers } = require('../../protocols');

const { getRequestHandler } = require('./request_handler');
const { launchServer } = require('./launch');
const { startEvent } = require('./event');

// Launch the servers for each protocol
const launchServers = async function (options) {
  // Make sure all servers are starting concurrently, not serially
  const serverFactsPromises = Object.values(protocolHandlers)
    .map(protocolHandler => kLaunchEachServer(options, protocolHandler));
  const serverFactsArray = await Promise.all(serverFactsPromises);

  const servers = Object.assign({}, ...serverFactsArray);

  return { servers };
};

// Launch the server of a given protocol
const launchEachServer = async function (options, protocolHandler) {
  const { runOpts, schema, measures } = options;
  const initialInput = {
    protocolHandler,
    runOpts,
    schema,
    options,
    measures,
    metadata: {},
  };
  const { server } = await reduceAsync(
    launchers,
    (input, func) => func(input),
    initialInput,
    (input, newInput) => ({ ...input, ...newInput }),
  );

  return { [protocolHandler.name]: server };
};

const kLaunchEachServer = monitor(
  launchEachServer,
  (options, { name }) => name,
  'servers',
);

const launchers = [
  getRequestHandler,
  launchServer,
  startEvent,
];

module.exports = {
  launchServers,
};
