'use strict';

const { GraphQLNonNull } = require('graphql');

// Returns whether a field is required
const graphQLRequiredTest = function (def, opts) {
  return optionalTests.every(testFunc => !testFunc(def, opts));
};

// Already wrapped in Required type
const isWrapped = function ({ requiredWrapped }) {
  return requiredWrapped;
};

// `attr.validate.required` must be true
const isNotRequiredValidated = function ({ validate = {} }) {
  return !validate.required;
};

// `args.filter` fields are never required, except `id` for single commands
const isFilterArg = function ({ command }, { inputObjectType }) {
  return inputObjectType === 'filter' && command.multiple;
};

// `patchOne|patchMany` do not require any attribute in `args.data`
const isPatchArg = function ({ command }, { inputObjectType }) {
  return inputObjectType === 'data' && command.type === 'patch';
};

// `data.id` is optional in createOne|createMany
const isCreateId = function ({ command }, { defName, inputObjectType }) {
  return inputObjectType === 'data' &&
    command.type === 'create' &&
    defName === 'id';
};

const optionalTests = [
  isWrapped,
  isNotRequiredValidated,
  isFilterArg,
  isPatchArg,
  isCreateId,
];

// Required field TGetter
const graphQLRequiredTGetter = function (def, opts) {
  const defA = { ...def, requiredWrapped: true };
  const subType = opts.getType(defA, opts);
  const type = new GraphQLNonNull(subType);
  return type;
};

module.exports = {
  graphQLRequiredTGetter,
  graphQLRequiredTest,
};
