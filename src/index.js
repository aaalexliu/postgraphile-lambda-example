const awsServerlessExpress = require('aws-serverless-express');
const { postgraphile } = require('postgraphile');
const { options } = require('./postgraphileOptions');
const combineMiddlewares = require('./combineMiddlewares');
const cors = require('cors');

// require so that webpack packages cache file
// const postgraphileCache = require('./postgraphile.cache');

const schemas = process.env.DATABASE_SCHEMAS
  ? process.env.DATABASE_SCHEMAS.split(',')
  : ['app_public'];

const app = combineMiddlewares([
  /*
   * Note that any middlewares you add here *must* call `next`.
   *
   * This is typically useful for augmenting the request before it goes to PostGraphile.
   */

  // CORS middleware to permit cross-site API requests. Configure to taste
  cors(),

  // Determines the effective URL we are at if `absoluteRoutes` is set
  (req, res, next) => {
    if (options.absoluteRoutes) {
      try {
        const event = JSON.parse(decodeURIComponent(req.headers['x-apigateway-event']));
        // This contains the `stage`, making it a true absolute URL (which we
        // need for serving assets)
        const realPath = event.requestContext.path;
        req.originalUrl = realPath;
      } catch (e) {
        return next(new Error('Processing event failed'));
      }
    }
    next();
  },
  // (req, res, next) => {
  //   console.log(req);
  // },
  
  // console.log(schemas),
  postgraphile(process.env.DATABASE_URL, schemas, {
    ...options,
    readCache: `${__dirname}/postgraphile.cache`,
  }),
]);

// console.log(app);
console.log('burh');
const handler = (req, res) => {
  console.log('hello');
  app(req, res, err => {
    console.log('bruh2');
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      console.log('fail');
      if (!res.headersSent) {
        res.statusCode = err.status || err.statusCode || 500;
        res.setHeader('Content-Type', 'application/json');
      }
      res.end(JSON.stringify({ errors: [{message: err.message}] }));
      return;
    }
    if (!res.finished) {
      if (!res.headersSent) {
        res.statusCode = 404;
      }
      res.end(`'${req.url}' not found`);
    }
  });
};

const binaryMimeTypes = options.graphiql ? ['image/x-icon'] : undefined;
console.log('yo1');
const server = awsServerlessExpress.createServer(handler, undefined, binaryMimeTypes);
console.log('yo2');
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);
