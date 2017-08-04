'use strict';

const { isJsl } = require('../../../../jsl');

const getDefaultValue = function ({
  def,
  def: { action },
  opts: { isRequired: isRequiredOpt, inputObjectType },
}) {
  // Can only assign default to input data that is optional.
  // 'update' does not required anything, nor assign defaults
  const hasDefaultValue = !isRequiredOpt &&
    inputObjectType === 'data' &&
    action.type !== 'update' &&
    def.default;
  if (!hasDefaultValue) { return; }

  // JSL only shows as 'DYNAMIC_VALUE' in schema
  const defaults = Array.isArray(def.default) ? def.default : [def.default];
  const isDynamic = defaults.some(jsl =>
    isJsl({ jsl }) || typeof jsl === 'function'
  );
  return isDynamic ? 'DYNAMIC_VALUE' : def.default;
};

module.exports = {
  getDefaultValue,
};
