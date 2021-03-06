'use strict';

const { keyBy, mapValues, pick, pickBy } = require('../utilities');
const { addGenPbHandler } = require('../errors');

// Wrap adapters to:
//  - add error handlers to catch adapter bugs
//  - only expose some `members`
//  - add `methods` bound with the adapter as first argument
const wrapAdapters = function ({
  adapters,
  members = [],
  methods = {},
  reason = 'ADAPTER',
}) {
  const adaptersA = keyBy(adapters);

  return mapValues(
    adaptersA,
    adapter => wrapAdapter({ adapter, members, methods, reason }),
  );
};

const wrapAdapter = function ({ adapter, members, methods, reason }) {
  const adapterA = addErrorHandlers({ adapter, reason });
  const wrapped = classify({ adapter: adapterA, members, methods });

  // We directly mutate so that methods are bound with `wrapped` parameter
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(adapterA, { wrapped });

  return { ...adapter, wrapped };
};

// Adapter functions should never throw
// If they do, it indicates an adapter bug, where we assign specific error
// reasons
// Except if they threw using throwError()
const addErrorHandlers = function ({ adapter, reason }) {
  const methods = pickBy(adapter, method => typeof method === 'function');
  const methodsA = mapValues(
    methods,
    method => addErrorHandler({ method, reason, adapter }),
  );
  const adapterA = { ...adapter, ...methodsA };
  return adapterA;
};

const addErrorHandler = function ({ method, reason, adapter: { name } }) {
  return addGenPbHandler(method, {
    reason: getReason.bind(null, reason),
    extra: { adapter: name },
  });
};

const getReason = function (reason, input, { reason: errorReason }) {
  if (errorReason && errorReason !== 'UNKNOWN') { return errorReason; }

  return reason;
};

// Similar to create a new class, but more functional programming-oriented
const classify = function ({ adapter, members, methods }) {
  const membersA = pick(adapter, members);
  const methodsA = mapValues(
    methods,
    method => method.bind(null, adapter),
  );
  return { ...membersA, ...methodsA };
};

module.exports = {
  wrapAdapters,
};
