# What this is

This is prototype for a web server engine.

You simply pass a [single declarative file](https://github.com/Coursio/api-engine/blob/master/src/idl/schema.json) as input, and the server generates a GraphQL server. The file format is based off standard [JSON schema](http://json-schema.org/).

The server is fully-featured, i.e. there should be not much need for custom code beyond that declarative file.

# What's already built

  - GraphQL endpoint
  - GraphQL introspection, including model type, optional/required, naming, description, deprecation status
  - GraphiQL interactive debugger
  - GraphQL schema can be printed as HTML
  - CRUD methods: find, create, update, replace, upsert, delete. Each operation can be performed on a single model (e.g. createOne) or on several models (e.g. createMany).
  - filters, e.g. `findUsers(name: "John")` or `findUser(id: 1)`
  - sorting, e.g. `findUsers(order_by: "name-,job_title+")`
  - selecting (handled natively by GraphQL)
  - nested operations. One can not only query but also mutate nested models in a single operation.
  - HTTP body/query handling
  - basic error handling
  - basic logging
  - basic routing

# What is work in progress

Includes (but is not limited to):
  - validation
  - authorization
  - default values, timestamps, computed values
  - aggregation
  - migrations
  - security
  - some HTTP features (CORS, caching, etc.)
  - pagination
  - performance optimization (could be 5 to 10 times faster with some basic tweaks, since much of the work can be done compile-time)
  - using real data source by adding an ORM (at the moment, all data lives in memory, using a JavaScript array)

# How to start

First `npm install`

If in production, run with `npm start`

If in development, run with `NODE_ENV=dev npm start`. This will start in watch mode (using `nodemon` and `node --inspect`).

A local server at `localhost:5001` will be spawned. Can be configured with environment variables `PORT` and `HOST`.

There are three ways of exploring the API:
  - direct GraphQL calls to `localhost:5001/graphql`
  - interactive exploration with `localhost:5001/graphiql`. Click on "docs" to see the schema.
  - schema printed as HTML with `localhost:5001/graphql/schema`

# Tooling

We recommend using the Chrome extension [Node Inspector Manager](https://github.com/june07/NIM) for Chrome devtools debugging.

We are using [editorconfig](http://editorconfig.org/), so please install the plugin for your IDE.

# Troubleshooting

  - Please use Node.js v7.8.0
  - Orphans are not currently handled, and will make the whole server crash as soon as only one orphan is created.