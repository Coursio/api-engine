# Starting the test server

Use `npm run build` instead of `npm install`.

Start the test server with `NODE_ENV=dev npm start`.
This will start in watch mode
(using [`nodemon`](https://github.com/remy/nodemon) and `node --inspect`).

A local HTTP server will be spawned at `http://localhost:5001`.

`npm run debug` is like `npm start` but using `node --inspect-brk`,
i.e. will put a breakpoint on server start.

To explore the API, please see this [documentation](docs/graphql.md).

# Testing

There is no automated testing yet.

`gulp test` will run linting, using [ESLint](http://eslint.org/)
for general linting,
and also checking code duplication.

# Coding style

We follow the [standard JavaScript style](https://standardjs.com), except
for semicolons and trailing commas.

Additionally, we enforce a pretty strong functional programming style with
[ESLint](http://eslint.org/), which includes: no complex or big functions,
no OOP, immutability everywhere, pure functions and no complex loops
or structures.

Also we prefer named arguments over positional, and we prefer async/await
over alternatives.

# Tooling

We are using [editorconfig](http://editorconfig.org/), so please install the plugin for your IDE.

# Troubleshooting

  - Please use Node.js v8.2.1
  - Orphans are not currently handled (but this will be fixed).
    This means if you are trying to query or mutate a model which contains a
    foreign key to a non-existing model, the action will crash.
    E.g. this means that to delete a model, all other model referencing it must
    remove their foreign keys first, otherwise they won't be accessible anymore.

# Terminology

TODO, about terminology and concepts (layer, middleware, protocol, operation,
GraphQLMethod, method, goal, command, action, attribute vs property, etc.)