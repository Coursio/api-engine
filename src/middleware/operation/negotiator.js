'use strict';


const { findKey } = require('lodash');


// Decides which operation to use (e.g. GraphQL) according to route
const operationNegotiator = function () {
  return async function operationNegotiator(input) {
    const { route, jsl, log } = input;
    const perf = log.perf.start('operation.negotiator', 'middleware');

    const operation = findKey(operations, test => test({ route }));

    const newJsl = jsl.add({ $OPERATION: operation });

    log.add({ operation });
    Object.assign(input, { operation, jsl: newJsl });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};

const operations = {

  GraphQL: ({ route }) => route === 'GraphQL',

  GraphiQL: ({ route }) => route === 'GraphiQL',

  GraphQLPrint: ({ route }) => route === 'GraphQLPrint',

};


module.exports = {
  operationNegotiator,
};