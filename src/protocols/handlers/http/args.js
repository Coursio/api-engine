'use strict';

const parsePreferHeaderLib = require('parse-prefer-header');

const { addGenErrorHandler } = require('../../../error');

const { getFormat, getCharset } = require('./format_charset');

// Using `Prefer: return=minimal` request header results in `args.silent` true.
const silent = function ({ specific }) {
  const preferHeader = eParsePreferHeader({ specific });
  const hasMinimalPreference = preferHeader.return === 'minimal';

  if (hasMinimalPreference) { return true; }
};

// Parses Prefer HTTP header
const parsePreferHeader = function ({
  specific: { req: { headers: { prefer } } },
}) {
  if (!prefer) { return {}; }

  return parsePreferHeaderLib(prefer);
};

const eParsePreferHeader = addGenErrorHandler(parsePreferHeader, {
  message: ({ prefer }) =>
    `HTTP 'Prefer' header value syntax error: '${prefer}'`,
  reason: 'INPUT_VALIDATION',
});

// HTTP-specific ways to set arguments
const args = {
  silent,
  format: getFormat,
  charset: getCharset,
};

module.exports = {
  args,
};
