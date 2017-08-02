'use strict';

const { groupMeasures, stringifyMeasures } = require('../perf');

const { reportLog } = require('./report');

const reportPerf = async function ({ log, measures }) {
  const { phase } = log;
  const measuresGroups = groupMeasures({ measures });
  const measuresMessage = stringifyMeasures({ phase, measuresGroups });
  await reportLog({
    log,
    level: 'log',
    message: '',
    info: { measures: measuresGroups, measuresMessage, type: 'perf' },
  });
};

module.exports = {
  reportPerf,
};