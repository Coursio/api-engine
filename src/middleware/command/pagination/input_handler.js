'use strict';

const { validatePaginationInput } = require('./validation');
const { mustPaginateOutput } = require('./condition');
const { getPaginationInput } = require('./input');

// Pagination input middleware.
// Supports several kinds of pagination:
//  - offset-based, for random access
//  - cursor-based, for serial access
//  - search query-based, e.g. by searching timestamps.
//    This is implemented by other layers though.
// Cursor-based pagination:
//  - the cursor stores the model attributes, not model.id:
//     - this allows paginating sorted and filtered requests
//     - this creates more stable results when the model is modified between
//       two batches
//  - the cursor should be opaque to consumer, i.e. is base64'd
//    (base64url variant so it is URL-friendly)
//  - the cursor is minified
// Pagination parameters are removed and transformed for the database layer to:
//   limit {integer}             - limit response size.
//                                 This might be higher than args.pageSize,
//                                 to guess if there is a previous or next page.
//   offset {integer}            - offset response size.
//                                 Only used with offset-based pagination
//   filter                      - with cursor-based pagination, uses the
//                                 `args.filter` of the previous request,
//                                 which is encoded in the cursor.
//                                 E.g. if last batch ended with model
//                                 { a: 10, b: 20 }, then we transform
//                                 args.filter { c: 30 } to
//                                 { c: 30, a: { gt: 10 }, b: { gt: 20 } }
//   orderBy                    - same as `filter` but for `orderBy`
// Add metadata: token, page_size, has_previous_page, has_previous_page
// Actions:
//  - output is paginated with any command.name returning an array of response
//    and do not using an array of args.data, i.e.
//    readMany, deleteMany or updateMany
//  - consumer can iterate the pagination with safe command.name returning an
//    array of response, i.e. readMany
//  - this means updateMany and deleteMany command.name will paginate output,
//    but to iterate through the next batches, readMany must be used
const handlePaginationInput = function ({
  args,
  command,
  action,
  modelName,
  idl,
  runOpts: { maxPageSize },
}) {
  validatePaginationInput({
    args,
    action,
    command,
    modelName,
    maxPageSize,
    idl,
  });

  if (!mustPaginateOutput({ args, command })) { return; }

  const paginationInput = getPaginationInput({ args });

  return { args: { ...args, ...paginationInput } };
};

module.exports = {
  handlePaginationInput,
};
