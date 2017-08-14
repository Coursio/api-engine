'use strict';

const { mapKeys } = require('../../utilities');

const renameKeys = function (requestInfo) {
  return mapKeys(requestInfo, (value, key) => renames[key] || key);
};

const renames = {
  errorReason: 'error',
  modelName: 'model',
};

module.exports = {
  renameKeys,
};