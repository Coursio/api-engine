'use strict';


const { parse } = require('graphql');

const { EngineError } = require('../../../../error');
const { memoize } = require('../../../../utilities');


// Raw GraphQL parsing
const parseQuery = memoize(function ({ query, method, operationName }) {
  if (!query) {
    const message = 'Missing GraphQL query';
    throw new EngineError(message, { reason: 'GRAPHQL_NO_QUERY' });
  }

  try {
    const queryDocument = parse(query);
    const { graphqlMethod } = validateQuery({
      queryDocument,
      method,
      operationName,
    });
    return { queryDocument, graphqlMethod };
  } catch (innererror) {
    const message = 'Could not parse GraphQL query';
    throw new EngineError(message, {
      reason: 'GRAPHQL_SYNTAX_ERROR',
      innererror,
    });
  }
});

// Make sure GraphQL query is valid
const validateQuery = function ({ queryDocument, method, operationName }) {
  // Get all query|mutation definitions
  const operationDefinitions = queryDocument.definitions.filter(({ kind }) => {
    return kind === 'OperationDefinition';
  });
  const definitions = operationDefinitions.filter(({
    name: { value: name } = {},
  }) => {
    return !operationName || name === operationName;
  });
  if (definitions.length === 0) {
    if (operationName) {
      const message = `Could not find GraphQL operation ${operationName}`;
      throw new EngineError(message, { reason: 'GRAPHQL_SYNTAX_ERROR' });
    } else {
      const message = 'Missing GraphQL query';
      throw new EngineError(message, { reason: 'GRAPHQL_NO_QUERY' });
    }
  }
  const definition = definitions[0];

  // GraphQL-anywhere do not support operationName yet,
  // so we must patch it until they do
  // See https://github.com/apollographql/graphql-anywhere/issues/34
  if (operationDefinitions.length > 1) {
    queryDocument.definitions = queryDocument.definitions.filter(def => {
      return !operationDefinitions.includes(def) || def === definition;
    });
  }

  if (method === 'find' && definition.operation !== 'query') {
    const message = 'Can only perform GraphQL queries, not mutations, with the current protocol method';
    throw new EngineError(message, { reason: 'GRAPHQL_SYNTAX_ERROR' });
  }

  return { graphqlMethod: definition.operation };
};


module.exports = {
  parseQuery,
  validateQuery,
};
