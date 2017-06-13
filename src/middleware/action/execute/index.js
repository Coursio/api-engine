'use strict';


const { mapAsync } = require('../../../utilities');
const { createAction } = require('./create');
const { findAction } = require('./find');
const { updateAction } = require('./update');
const { upsertAction } = require('./upsert');
const { replaceAction } = require('./replace');
const { deleteAction } = require('./delete');


// Translates operation-specific calls into generic instance actions
const actionExecute = async function (opts) {
  const { startupLog } = opts;
  const mdws = await mapAsync(middlewares, async (mdw, name) => {
    const perf = startupLog.perf.start(`action.${name}`, 'middleware');
    mdw = await mdw(opts);
    perf.stop();
    return mdw;
  });

  return async function actionExecute(input) {
    return await mdws[input.action.name].call(this, input);
  };
};

const middlewares = {
  createOne: createAction,
  createMany: createAction,
  findOne: findAction,
  findMany: findAction,
  updateOne: updateAction,
  updateMany: updateAction,
  upsertOne: upsertAction,
  upsertMany: upsertAction,
  replaceOne: replaceAction,
  replaceMany: replaceAction,
  deleteOne: deleteAction,
  deleteMany: deleteAction,
};


module.exports = {
  actionExecute,
};
