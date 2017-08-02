'use strict';

const { assignArray } = require('../../../utilities');
const { throwError } = require('../../../error');

// Get transforms order according to `using` property
const setOrder = function (type, model, { modelName }) {
  if (!model.properties) { return model; }

  const props = getAllTransformUsing({ model, modelName });
  const order = findTransformOrder({ props, modelName });

  return { ...model, [`${type}Order`]: order };
};

// `compute` reuse the same logic as `transform`
const setTransformOrder = setOrder.bind(null, 'transform');
const setComputeOrder = setOrder.bind(null, 'compute');

// Returns array of properties having a transform, together with `using`
// properties, as [{ attrName, using: [...] }, ...]
const getAllTransformUsing = function ({ model: { properties }, modelName }) {
  const attributes = Object.keys(properties);

  return Object.entries(properties)
    .filter(([, { transform }]) => transform)
    .map(([attrName, { transform }]) => {
      const using = getUsing({ attrName, transform, attributes, modelName });
      return { attrName, using };
    });
};

const getUsing = function ({ transform, ...rest }) {
  // Merge all `using` properties
  const transformUsing = transform
    .map(({ using = [] }) => using)
    .reduce(assignArray, []);

  return validateUsing({ transformUsing, ...rest });
};

// Make sure `using` properties point to an existing attribute
const validateUsing = function ({
  transformUsing,
  attributes,
  modelName,
  attrName,
}) {
  return transformUsing.map(
    using => validateOneUsing({ using, attributes, modelName, attrName }),
  );
};

const validateOneUsing = function ({ using, attributes, modelName, attrName }) {
  if (!attributes.includes(using)) {
    const message = `'using' property is invalid in model '${modelName}': attribute '${using}' does not exist`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }

  if (using === attrName) {
    const message = `'using' property is invalid in model '${modelName}': '${using}' refers to current attribute`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }

  return using;
};

// Returns order in which transforms should be applied, according to `using`
// Returned as an array of attribute names
const findTransformOrder = function ({ props, modelName, triedProps = [] }) {
  checkTransformCircular({ props, modelName, triedProps });

  const recTransformOrder = props.find((prop, index) =>
    findRecTransformOrder({ props, modelName, triedProps, index, prop })
  );
  if (recTransformOrder) { return recTransformOrder; }

  const transformOrder = props.map(({ attrName }) => attrName);
  return transformOrder;
};

const findRecTransformOrder = function ({
  props,
  modelName,
  triedProps,
  index,
  prop,
}) {
  const nextProps = props.slice(index + 1);
  // Means the attribute is currently behind another attribute that should be
  // behind
  const isWrongOrder = prop.using.some(
    orderAttr => isSameAttr({ nextProps, orderAttr }),
  );

  if (!isWrongOrder) { return; }

  // Push the current attribute to the end of the array, and try again
  const previousProps = props.slice(0, index);
  const propsA = [...previousProps, ...nextProps, prop];
  return findTransformOrder({ props: propsA, modelName, triedProps });
};

const isSameAttr = function ({ nextProps, orderAttr }) {
  return nextProps.some(({ attrName }) => attrName === orderAttr);
};

// If two properties point to each other with `using` property, it means
// each must be before the other, which is invalid, and will throw
// exceptions during `getTransformOrder()`
const checkTransformCircular = function ({ props, modelName, triedProps }) {
  const strProps = props.map(({ attrName }) => attrName).join(',');

  if (triedProps.includes(strProps)) {
    const message = `Circular dependencies in 'using' properties of model '${modelName}'`;
    throwError(message, { reason: 'IDL_VALIDATION' });
  }

  // eslint-disable-next-line fp/no-mutating-methods
  triedProps.push(strProps);
};

module.exports = {
  setTransformOrder,
  setComputeOrder,
};