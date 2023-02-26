const {List,List_likes,List_movies, User, Film, Film_likes} = require('../db/models/models')
const {ServerConnection,Api404Error,BadRequest} = require('../errors/errors.js')
const { Op } = require("sequelize");


const pushLike = async (req,res) => {

    const {film} = req.body
    const {userId} = req
    const {serieId,title,year, posterPath, backdropPath} = film


    try {

        const serieExists = await Film.findAll({
            // where : {
            //     id : serieId
            // }
            where : {
                title: title
            }
        })


        if (!serieExists.length) {

            await Film.create({title:title,year:year, poster_path: posterPath, backdrop_path: backdropPath})
        }

        
        const response = await Film_likes.create({
            film_id: serieExists[0].dataValues.id,
            client_id: userId 
        },{fields : ["film_id","client_id"]})
        // const response = await Film_likes.create({film_id: serieId, user_id: userId })

        res.send(response)
    
    } catch (error) {

        if (error?.statusCode) {

            res.status(error.statusCode).send({message: error.name})
    
        } else {
    
            const error = new ServerConnection("Connetion to server failed. Please try again in a few seconds")
    
            res.status(error.statusCode).send({message: error.name})
        }

        console.log(error)

    }
}


const getUserLikes = async (req,res)=> {

    const {id} = req.params

    try {

        const response = await List_likes.findAll({
            where: {
                client_id : id
            },
            attributes: ['id'],
            include : [
                {
                    model: List, 
                    attributes: ['id', 'description', 'client_id'],
                    include : {
                        model: List_movies,
                        attributes: ['id', 'film_id'],
                        include: {
                            model: Film,
                            attributes: ['id','title','year', 'poster_path', 'backdrop_path']
                        }
                    }
                }
            ]
        })

        const seriesLikes = await Film_likes.findAll({
            where: {
                client_id : id
            },
            attributes: ['id'],
            include : [
                {
                    model: Film, 
                }
            ]
        })

    
        const list = response.map((x)=> x.dataValues)
        const series = seriesLikes.map((x)=> x.dataValues)


    
        if (!list.length) {
            throw new BadRequest("No lists present at the database")
        }
    
        res.send({lists:list, series: series})
    

    } catch (error) {

        if (error?.statusCode) {

            res.status(error.statusCode).send({message: error.name})
    
        } else {
    
            const error = new ServerConnection("Connetion to server failed. Please try again in a few seconds")
    
            res.status(error.statusCode).send({message: error.name})
        }

        console.log(error)

        
    }
}

module.exports = {

    pushLike,
    getUserLikes

}