'use strict';

const { defaultsDeep } = require('lodash');

// Default value for main options
const applyDefaultOptions = function ({ confOpts, oServerOpts }) {
  return defaultsDeep({}, oServerOpts, confOpts, defaultOptions);
};

const defaultOptions = {
  // eslint-disable-next-line no-process-env
  env: process.env.NODE_ENV || 'production',
  maxDataLength: 1000,
  defaultPageSize: 100,
  maxPageSize: 100,
  logLevel: 'info',
  logFilter: {
    payload: ['id'],
    response: ['id'],
    argData: ['id'],
    actionResponses: ['id'],
    headers: false,
    queryVars: false,
    params: false,
    settings: false,
  },
  http: {
    enabled: true,
    host: 'localhost',
    port: 80,
  },
};

module.exports = {
  applyDefaultOptions,
};