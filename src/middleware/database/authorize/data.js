'use strict';

const { throwCommonError } = require('../../../error');
const { evalFilter } = require('../../../database');

// Check `model.authorize` `$model.*` against `args.newData`
const checkNewData = function ({
  authorize,
  args: { newData },
  modelName,
  top,
}) {
  if (newData === undefined) { return; }

  const ids = newData
    .filter(datum => !evalFilter({ filter: authorize, attrs: datum }))
    .map(({ id }) => id);
  if (ids.length === 0) { return; }

  throwCommonError({ reason: 'AUTHORIZATION', ids, modelName, top });
};

module.exports = {
  checkNewData,
};