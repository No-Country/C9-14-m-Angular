const {List,List_likes,List_movies, User, Film, Film_likes} = require('../db/models/models')
const {ServerConnection,Api404Error,BadRequest} = require('../errors/errors.js')
const { Op } = require("sequelize");


const pushLike = async (req,res) => {

    const {film} = req.body
    const {userId} = req
    const {id,name,year, poster_path, backdrop_path} = film


    try {

        const serieExists = await Film.findAll({
            where : {
                id : id
            }
            // where : {
            //     title: title
            // }
        })


        if (!serieExists.length) {

            await Film.create({id: id,title:name,year:year, poster_path: poster_path, backdrop_path: backdrop_path})
        }

        const existLike = await Film_likes.findAll({
            where: {
                film_id: id,
                client_id: userId
            }
        })

        if(existLike.length) throw new BadRequest("Already liked")
        
        const response = await Film_likes.create({
            film_id: id,
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

    const {userId} = req
 
    try {

        const response = await List_likes.findAll({
            where: {
                client_id : userId
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
                client_id : userId
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

        // if (!list.length) {
        //     throw new BadRequest("No lists present at the database")
        // }
    
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

const removeLike = async (req,res) => {

    const {serieId} = req.body

    try {

        const response = await Film_likes.destroy({
            where : {
                film_id: serieId,
            }
        })
        
        if (response === 1) {

            res.send({message: "deleted succesfully"})
        } else{
            throw new BadRequest("Like not present in the database")
        }


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

//agregar remover like

module.exports = {

    pushLike,
    getUserLikes,
    removeLike

}