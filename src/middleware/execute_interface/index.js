'use strict';


const { getSwitchMiddleware } = require('../../utilities');
const { executeGraphql } = require('./graphql');
const { executeGraphiql } = require('./graphiql');
const { printGraphql } = require('./graphql_print');


const middlewares = {
  graphql: executeGraphql,
  graphiql: executeGraphiql,
  graphql_print: printGraphql,
};
const getKey = ({ input: { info } }) => info.interface;

// Translates interface-specific calls into generic instance actions
const executeInterface = getSwitchMiddleware({ middlewares, getKey });


module.exports = {
  executeInterface,
};
