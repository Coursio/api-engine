'use strict';

const { throwError } = require('../../error');
const { COMMANDS } = require('../../constants');
const { assignObject } = require('../../utilities');

// Main authorization layer
const authorization = function ({ modelName, command, idl: { models }, args }) {
  const model = models[modelName];
  validateCommands({ model, command, args });
};

const validateCommands = function ({
  model: { commands },
  command,
  args: { internal },
}) {
  // Intermediary commands are not checked for authorization
  if (internal) { return; }

  const mappedCommands = authorizationMap[command.name] || [command];

  mappedCommands.forEach(
    mappedCommand => validateCommand({ commands, mappedCommand }),
  );
};

const validateCommand = function ({ commands, mappedCommand }) {
  const isAllowed = commands.includes(mappedCommand.name);

  if (!isAllowed) {
    const message = `Command '${mappedCommand.type}' is not allowed`;
    throwError(message, { reason: 'AUTHORIZATION' });
  }
};

const {
  readOne,
  readMany,
  updateOne,
  createOne,
  updateMany,
  createMany,
} = COMMANDS
  .map(command => ({ [command.name]: command }))
  .reduce(assignObject, {});
const authorizationMap = {
  // `upsert` action requires both `update` + `create` commands
  upsertOne: [updateOne, createOne],
  upsertMany: [updateMany, createMany],
  // `update` action requires both `update` + `read` commands
  updateOne: [updateOne, readOne],
  updateMany: [updateMany, readMany],
};

module.exports = {
  authorization,
};
