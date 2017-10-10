'use strict';

const { getOptions } = require('../../options');

// Retrieve instruction options
const getCompileOpts = async function ({ compileOpts }) {
  const { options } = await getOptions({
    instruction: 'compile',
    options: compileOpts,
  });
  return { compileOpts: options, schema: options.schema };
};

module.exports = {
  getCompileOpts,
};