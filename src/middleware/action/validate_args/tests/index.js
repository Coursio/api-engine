'use strict';

module.exports = {
  ...require('./select'),
  ...require('./filter'),
  ...require('./order_by'),
  ...require('./pagination'),
  ...require('./data'),
  ...require('./cascade'),
  ...require('./dryrun'),
  ...require('./silent'),
  ...require('./params'),
  ...require('./required'),
  // eslint-disable-next-line import/max-dependencies
  ...require('./unknown'),
};