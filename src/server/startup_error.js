'use strict';

const { getStandardError, getErrorMessage } = require('../error');
const { reportLog } = require('../logging');

// Handle exceptions thrown at server startup
const handleStartupError = async function ({
  error: err,
  startupLog,
  apiServer,
}) {
  const standardError = getStandardError({ log: startupLog, error: err });
  const message = getErrorMessage({ error: standardError });
  await reportLog({
    log: startupLog,
    level: 'error',
    message,
    info: { type: 'failure', errorInfo: standardError },
  });

  // Stops servers if some were started
  try {
    await apiServer.emitAsync('startupError');
  } catch (error) {}

  // Throws if no listener was setup
  await apiServer.emitAsync('error', standardError);
};

module.exports = {
  handleStartupError,
};
