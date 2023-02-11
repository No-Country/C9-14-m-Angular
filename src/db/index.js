const pkg = require ('pg')
const { DB_USER, DB_HOST, DB_PASS, DB_NAME, DB_PORT } = require('../config/config')
const Sequelize = require('sequelize');


const pool = new Sequelize(`postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:5432/${DB_NAME}?sslmode=no-verify`, {
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});


module.exports = {pool}