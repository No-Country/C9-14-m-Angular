
const httpStatusCodes = require('./statusCodes')

class BaseError extends Error {
    constructor (name, statusCode, isOperational, description) {
    super(description)
   
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = name
    this.statusCode = statusCode
    this.isOperational = isOperational
    Error.captureStackTrace(this)
    }
   }
   


    class Api404Error extends BaseError {
    constructor (
    name,
    statusCode = httpStatusCodes.NOT_FOUND,
    description = 'The indicated information was not found among the server parameters',
    isOperational = true
    ) {
    super(name, statusCode, isOperational, description)
    }
    }


    class BadRequest extends BaseError {
        constructor (
        name,
        statusCode = httpStatusCodes.BAD_REQUEST,
        description = 'Api communication failed due to client error. Check the input data and try again',
        isOperational = true
        ) {
        super(name, statusCode, isOperational, description)
        }
    }

    class ServerConnection extends BaseError {
        constructor (
        name,
        statusCode = httpStatusCodes.INTERNAL_SERVER,
        description = 'Connection with internal servers failed. ',
        isOperational = true
        ) {
        super(name, statusCode, isOperational, description)
        }
    }
   
   
   module.exports = {Api404Error,BadRequest,ServerConnection}
