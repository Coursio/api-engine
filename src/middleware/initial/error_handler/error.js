'use strict';

const { getStandardError } = require('../../../error');

const { getResponse } = require('./response');
const { reportError } = require('./report');

const handleError = async function ({ log, error, error: { protocolStatus } }) {
  const standardError = getStandardError({ log, error });
  await reportError({ log, error: standardError });

  // Use protocol-specific way to send back the response to the client
  if (error.sendError) {
    const errorResponse = getResponse({ error: standardError });
    const response = { ...errorResponse, protocolStatus };
    await error.sendError(response);
  }

  return standardError;
};

module.exports = {
  handleError,
};
