'use strict';


const { getDataArgument } = require('./data');
const { getFilterArgument } = require('./filter');
const { getOrderArgument } = require('./order');
const { getPaginationArgument } = require('./pagination');
const { getDryRunArguments } = require('./dry_run');


// Retrieves all resolver arguments, before resolve function is fired
const getArguments = function (def, opts) {
  const options = Object.assign({}, opts, { def });
  return Object.assign(
    {},
		getDataArgument(options),
		getFilterArgument(options),
    getOrderArgument(options),
    getPaginationArgument(options),
    getDryRunArguments(options)
  );
};


module.exports = {
  getArguments,
};
