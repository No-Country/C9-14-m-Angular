const {List,List_likes,List_movies, User, Film, Film_likes} = require('../db/models/models')
const {ServerConnection,Api404Error,BadRequest} = require('../errors/errors.js')
const { Op } = require("sequelize");
const redis = require("redis");
const { redisClient } = require('../middleware/activity');



const pushLike = async (req,res,next) => {

    const {film} = req.body
    const {userId} = req
    const {id,name,year, poster_path, backdrop_path} = film
    const idstring = 'userid'+userId.toString()
    const date = new Date().toISOString()


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

        const cacheResults = await redisClient.lRange(`${idstring}`,0,100);
        if(cacheResults.length < 20) {
                await redisClient.rPush(`${idstring}`,["You liked serie"+ `${id}`, `${date}` ]);
        }
    

        res.send(response)
    
    } catch (error) {

        next(error)

    }
}

const getUserLikes = async (req,res,next)=> {

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

        next(error)
        
    }
}

const removeLike = async (req,res,next) => {

    const {serieId} = req.body
    const {userId} = req
    const idstring = 'userid'+userId.toString()
    const date = new Date().toISOString()

    

    try {

        const response = await Film_likes.destroy({
            where : {
                film_id: serieId,
            }
        })
        
        if (response === 1) {

            const cacheResults = await redisClient.lRange(`${idstring}`,0,100);
            if(cacheResults.length < 20) {
                    await redisClient.rPush(`${idstring}`,["You removed a like to serie "+`${serieId}`, `${date}` ]);
            }
        

            res.send({message: "deleted succesfully"})
        } else{
            throw new BadRequest("Like not present in the database")
        }


    } catch (error) {

        next(error)

    }
}


module.exports = {

    pushLike,
    getUserLikes,
    removeLike

}