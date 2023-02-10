require('custom-env').env('staging')


const APP_ENV = process.env.APP_ENV
const DB_USER = process.env.DB_USER
const DB_NAME = process.env.DB_NAME
const DB_HOST = process.env.DB_HOST
const DB_PASS = process.env.DB_PASS
const DB_PORT = process.env.DB_PORT
const PORT = process.env.PORT
const APP_SECRET = process.env.APP_SECRET
const EMAIL_HOST = process.env.EMAIL_HOST
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD
const EMAIL_USER = process.env.EMAIL_USER

module.exports= {
    DB_HOST,DB_NAME,DB_PASS,DB_PORT,DB_USER,PORT,APP_ENV,APP_SECRET,EMAIL_HOST,EMAIL_PASSWORD,EMAIL_USER
}