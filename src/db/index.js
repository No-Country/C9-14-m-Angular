const pkg = require ('pg')
const { DB_USER, DB_HOST, DB_PASS, DB_NAME, DB_PORT, APP_ENV } = require('../config/config')
const Sequelize = require('sequelize');


let pool

if (APP_ENV === 'development') {


   pool = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

} else {

   pool = new Sequelize(`postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:5432/${DB_NAME}?sslmode=no-verify`, {
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

}

module.exports = {pool}