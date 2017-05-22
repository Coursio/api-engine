'use strict';


const { getJslVariables } = require('./variables');


// Process (already compiled) JSL function, i.e. fires it and returns its value
// If this is not JSL, returns as is
const runJsl = function (jslFunc, jslInput, extra) {
  if (typeof jslFunc !== 'function') { return jslFunc; }

  const input = Object.assign({}, jslInput, extra);
  const variables = getJslVariables(jslFunc, input);
  return jslFunc(variables);
};


module.exports = {
  runJsl,
};
