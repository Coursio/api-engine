'use strict';

const { fullRecurseMap, mapValues } = require('../../../utilities');
const { throwError } = require('../../../error');

// Validate JSON schema `$data` properties
const validateJsonSchemaData = function ({ idl }) {
  return fullRecurseMap(idl, validateDataMapper);
};

const validateDataMapper = function (obj) {
  if (!obj || obj.constructor !== Object) { return obj; }

  return mapValues(obj, child => {
    if (!child || !child.$data) { return child; }
    return validateDataFormat(child);
  });
};

// Validates that $data is { $data: '...' }
const validateDataFormat = function (obj) {
  if (typeof obj.$data !== 'string') {
    const message = `'$data' must be a string: ${obj.$data}`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }

  if (Object.keys(obj).length > 1) {
    const val = JSON.stringify(obj);
    const message = `'$data' must be the only property when specified: '${val}'`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }

  return obj;
};

module.exports = {
  validateJsonSchemaData,
};