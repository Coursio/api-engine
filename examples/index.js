'use strict';

const apiEngine = require('../index');

// eslint-disable-next-line fp/no-mutation
Error.stackTraceLimit = 100;

const startServer = async function () {
  try {
    const { options, servers, exit } = await apiEngine.run();
    return { options, servers, exit };
  } catch (error) {}
};

startServer();
