'use strict';

// Retrieve IDL functions variables, using the request mInput
const getVars = function ({
  protocol: $PROTOCOL,
  timestamp: $TIMESTAMP,
  ip: $IP,
  requestId: $REQUEST_ID,
  params: $PARAMS,
  settings: $SETTINGS,
  operation: $OPERATION,
  modelName: $MODEL,
  args: $ARGS,
  command: { type: $COMMAND } = {},
}) {
  return {
    $PROTOCOL,
    $TIMESTAMP,
    $IP,
    $REQUEST_ID,
    $PARAMS,
    $SETTINGS,
    $OPERATION,
    $MODEL,
    $ARGS,
    $COMMAND,
  };
};

// Retrieve IDL functions variables names
const getVarsKeys = function ({ idl: { helpers = {} } }) {
  return [...VARS_KEYS, ...Object.keys(helpers)];
};

const VARS_KEYS = [
  '$PROTOCOL',
  '$TIMESTAMP',
  '$REQUEST_ID',
  '$IP',
  '$SETTINGS',
  '$PARAMS',
  '$OPERATION',
  '$MODEL',
  '$ARGS',
  '$COMMAND',
  '$EXPECTED',
  '$1',
  '$2',
  '$3',
  '$4',
  '$5',
  '$6',
  '$7',
  '$8',
  '$9',
  '$$',
  '$',
];

module.exports = {
  getVars,
  getVarsKeys,
};