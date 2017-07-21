'use strict';

const { cloneDeep } = require('lodash');

const { pick } = require('../../../utilities');

const { getLogActions } = require('./log_actions');
const { getTransformedResponse } = require('./transform');

// Converts from Operation format to Action format
const actionConvertor = async function (input) {
  const { args, modelName, jsl, log, action, fullAction, operation } = input;

  const trimmedInput = pick(input, actionAttributes);
  const nextInput = jsl.addToInput(trimmedInput, { $MODEL: modelName });

  // Request arguments that cannot be specified by clients
  const clonedArgs = cloneDeep(args);

  try {
    const response = await this.next(nextInput);
    const transformedResponse = handleResponse({
      response,
      input: nextInput,
      args: clonedArgs,
      operation,
    });
    return transformedResponse;
  } catch (error) {
    // Added only for final error handler
    log.add({ action, fullAction, model: modelName });

    throw error;
  }
};

// Not kept: goal, queryVars, pathVars, payload, route, operation
const actionAttributes = [
  'action',
  'fullAction',
  'args',
  'modelName',
  'log',
  'perf',
  'idl',
  'serverOpts',
  'apiServer',
  'params',
  'settings',
];

const handleResponse = function ({
  response,
  input,
  input: { log },
  args,
  operation,
}) {
  const logActions = getLogActions({ input, response, args });
  log.add({ actions: logActions });

  const transformedResponse = getTransformedResponse({
    input,
    response,
    args,
    operation,
  });
  return transformedResponse;
};

module.exports = {
  actionConvertor,
};
