// This script is called from scripts/generate-cache
const { createPostGraphileSchema } = require('postgraphile');
const { options } = require('./postgraphileOptions');
const { Pool } = require('pg');
const { resolve } = require("path");
require('dotenv').config();


const schemas = process.env.DATABASE_SCHEMAS
  ? process.env.DATABASE_SCHEMAS.split(',')
  : ['app_public'];

async function main() {
  console.log('hello')
  const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  // console.log(pgPool);

  console.log(`${__dirname}/../dist/postgraphile.cache`);
  const writeTo = resolve(__dirname,'../dist/postgraphile.cache');
  console.log(writeTo); 
  // console.log(schemas);
  console.log(process.env.DATABASE_URL);
  debugger;
  await createPostGraphileSchema(pgPool, schemas, {
    ...options,
    writeCache: writeTo,
  });
  console.log('yoo');
  debugger;
  await pgPool.end();
}

main().then(null, e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
