exports.options = {
  dynamicJson: true,
  cors: true,
  graphiql: false,
  graphqlRoute: '/graphql',
  externalUrlBase: `/${process.env.AWS_STAGE}`,

  // If consuming JWT:
  jwtSecret: process.env.JWT_SECRET || String(Math.random()),
  // If generating JWT:
  jwtPgTypeIdentifier: process.env.JWT_PG_TYPE_IDENTIFIER,

  /* If you want to enable GraphiQL, you must use `externalUrlBase` so PostGraphile
   * knows where to tell the browser to find the assets.  Doing this is
   * strongly discouraged, you should use an external GraphQL client instead.

    graphiql: true,
    enhanceGraphiql: true,
    graphqlRoute: '/',
    graphiqlRoute: '/graphiql',
  */

  // development options
  subscriptions: true,
  // watchPg: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  ignoreIndexes: false,
  showErrorStack: "json",
  extendedErrors: ["hint", "detail", "errcode"],
  appendPlugins: [require("@graphile-contrib/pg-simplify-inflector")],
  // exportGqlSchemaPath: "../tmp/schema.graphql",
  graphiql: true,
  enhanceGraphiql: true,
  allowExplain(req) {
    // TODO: customise condition!
    return true;
  },
  enableQueryBatching: true,
  legacyRelations: "omit",
  // writeCache: '../tmp/',
};
