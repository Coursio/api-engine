'use strict';

const { addGenErrorHandler } = require('../../../error');

// Request body decompression
// Input is buffer. Output might be either string of buffer.
const decompressPayload = function ({ compressRequest, payload }) {
  if (compressRequest === undefined) { return payload; }

  return compressRequest.decompress({ content: payload });
};

const eDecompressPayload = addGenErrorHandler(decompressPayload, {
  message: ({ compressRequest: { title } }) =>
    `Could not decompress the request payload using the ${title} algorithm`,
  reason: 'REQUEST_FORMAT',
});

module.exports = {
  decompressPayload: eDecompressPayload,
};