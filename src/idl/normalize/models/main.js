'use strict';

const { mapValues } = require('../../../utilities');

const { normalizers } = require('./normalizers');

// Normalize all models and their attributes
const normalizeAllModels = function ({ idl }) {
  return normalizers.reduce(
    (idlA, { type, func }) => normalizeFuncs[type](func, { idl: idlA }),
    idl,
  );
};

// Apply a mapping function on each model
const normalizeModels = function (func, { idl, idl: { models } }) {
  const modelsA = mapValues(
    models,
    (model, modelName) => func(model, { modelName, idl }),
  );
  return { ...idl, models: modelsA };
};

// Apply a mapping function on each model's attribute
const normalizeAllAttrs = function (func, { idl }) {
  return normalizeModels(
    model => normalizeAttrs(func, model, { idl }),
    { idl },
  );
};

const normalizeAttrs = function (func, model, { idl }) {
  const { attributes } = model;
  if (!attributes) { return model; }

  const attributesA = mapValues(
    attributes,
    (attr, attrName) => func(attr, { attrName, idl }),
  );
  return { ...model, attributes: attributesA };
};

const normalizeFuncs = {
  model: normalizeModels,
  attr: normalizeAllAttrs,
};

module.exports = {
  normalizeAllModels,
};
