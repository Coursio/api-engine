'use strict';

const { format: formatBytes } = require('bytes');

const { throwError, addErrorHandler, isError } = require('../../../errors');

// Use protocol-specific way to parse payload, using a known type
const getRawPayload = function ({ protocolAdapter, specific, maxpayload }) {
  return protocolAdapter.getPayload({ specific, maxpayload });
};

const getRawPayloadHandler = function (error, { maxpayload }) {
  if (!isError({ error })) {
    const message = 'Could not parse request payload';
    throwError(message, { reason: 'PAYLOAD_NEGOTIATION', innererror: error });
  }

  if (error.reason === 'PAYLOAD_LIMIT') {
    const message = `The request payload must not be larger than ${formatBytes(maxpayload)}`;
    throwError(message, { reason: 'PAYLOAD_LIMIT', innererror: error });
  }

  // eslint-disable-next-line fp/no-throw
  throw error;
};

const eGetRawPayload = addErrorHandler(getRawPayload, getRawPayloadHandler);

module.exports = {
  getRawPayload: eGetRawPayload,
};
