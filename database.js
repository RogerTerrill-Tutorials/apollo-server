// To use the dotenv package, we will have to require it
// which will give us access to the variables we created in the
// .env file
require('dotenv').config();

// Got create an instance of pg-promise, we will also require it
const pgp = require('pg-promise')();

// Create the config for the pgp instance
const config ={
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: true
}

// Pull the database from our config
const db = pgp(config);

exports.db = db;