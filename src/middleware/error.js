const { ServerConnection } = require("../errors/errors")


const errorHandler = async (error,req,res,next) => {
    
    if (error?.statusCode) {

        res.status(error.statusCode).send({message: error.name})

    } else {

        const error = new ServerConnection("Connetion to server failed. Please try again in a few seconds")

        res.status(error.statusCode).send({message: error.name})
    }

    console.log(error)
}

module.exports = {
    errorHandler
}