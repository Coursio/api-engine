'use strict';

const { throwError } = require('../../error');

// Operation middleware input validation
// Those errors should not happen, i.e. server-side (e.g. 500)
const operationValidationIn = function (input) {
  const { operation, route } = input;

  if (!operation) {
    const message = `Unsupported operation: ${route}`;
    throwError(message, { reason: 'UNSUPPORTED_OPERATION' });
  }

  return input;
};

module.exports = {
  operationValidationIn,
};
