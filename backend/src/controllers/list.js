const {List,List_likes,List_movies, User, Film} = require('../db/models/models')
const {ServerConnection,Api404Error,BadRequest} = require('../errors/errors.js')
const { Op } = require("sequelize");
const { addRandomCover } = require('../utils/list');
const redis = require("redis");
const { redisClient } = require('../middleware/activity');

const getAll = async (req,res,next) => {

try {

    const response = await List.findAll({
        include: [
            {
                model: User,
                attributes: ['id','name']
            },
            {
                model: List_movies,
                attributes: ['id', 'film_id'],
                include: {
                    model: Film,
                    attributes: ['id','title','year']
                }

            }
      
        ]
    })

    const users = response.map((x)=> x.dataValues)

    if (!users.length) {
        throw new BadRequest("No lists present at the database")
    }

    res.send(users)
    
} catch (error) {

next(error)
    
}
     
}

const getList = async(req,res,next) => {

    const {id} = req.params

    try {
        // const response = await List_movies.findAll({
        //     where: {
        //         list_id : id
        //     }
        // })

        const response = await List.findAll({
            where: {
                id : id
            },
            attributes: ["id","description","client_id"],
            include : [
                {
                    model: List_movies,
                    attributes: ["id"],
                    include: {
                        model: Film,
                        attributes:["id","title","year","poster_path","backdrop_path"]
                    }
                }
            ]
        })


        if (!response.length) throw new BadRequest ("Non existing List")

        res.send(response)

    } catch (error) {

        next(error)

    }
}

const getUserLists = async (req,res,next) => {


    const {userId} = req
 
try {


    const response = await List.findAll({
        where: {
            client_id : userId
        },
        attributes: ["id","description"],
        include: [
            {
                model: User,
                attributes: ['id','name']
            },
            {
                model: List_movies,
                attributes: ['id', 'film_id'],
                include: {
                    model: Film,
                    attributes: ['id','title','year', 'poster_path', 'backdrop_path']
                }

            }
      
        ]
    })

    const users = response.map((x)=> {

        x.dataValues.cover = addRandomCover(x.dataValues)

        // delete x.dataValues.list_movies

        return  x.dataValues

    })

    if (!users.length) {
        throw new BadRequest("No lists present at the database")
    }


    res.send(users)
    
} catch (error) {

    next(error)

}


} 

const createList = async (req,res,next) => {

    const {description,films} = req.body

    const {userId} = req
    const idstring = 'userid'+userId.toString()
    const date = new Date().toISOString()


    try {

        const cacheResults = await redisClient.lRange(`${idstring}`,0,100);
        if(cacheResults.length < 20) {
                await redisClient.rPush(`${idstring}`,["You created a list", `${date}` ]);
        }
    

        if (films)  {

            const filmIds = films.map((x)=> x.id)

            const existingFilms = await Film.findAll({
                where : {
                    id : {
                        [Op.or] : filmIds
                    }
                }
            })
    
    
            if (!existingFilms.length) {
    
                const response = await List.create({
                    description,
                    client_id: userId,
                    list_movies : films.map((film)=> ({
                        film: film
                    }))
                  }, {
                    include: [{
                      association: List.List_movies,
                      include:  List_movies.Film 
                    }]
                  });
                  
                  res.send(response)
        
            } else {
                // const filmsId = existingFilms.map((film)=> film.id)
                const response = await List.create({
                    description,
                    client_id: userId,
                    list_movies : filmIds.map((film)=> ({
                        film_id: film
                    }))
                }, {
                    include: [{
                      association: List.List_movies,
                    }]
                  });
                  res.send(response)    

            }
        } else {
            const response = await List.create({
                description,
                client_id: userId
            })

            res.send(response)
        }
        
    } catch (error) {

        next(error)
    }
}

//we tested considering a manual creation and with the series selected in that moment
// I need to add the list creation whenever the user clicks on fav or like. So I need to grab that original list
// and create a new one with that information. Therefore, the user can start updating it because its him's


const removeFilm = async (req,res,next) => {

    const {listId, films} = req.body
    const {userId} = req
    const idstring = 'userid'+userId.toString()
    const date = new Date().toISOString()
    
 
    try {

        const existData = await List.findAll({
            where: {
                id : listId
            },
            include: [
                {
                    model: User,
                    attributes: ['id','name']
                },
                {
                    model: List_movies,
                    attributes: ['id', 'film_id'],
                    include: {
                        model: Film,
                        attributes: ['id','title','year']
                    }
    
                }
            ]
        })

        
        if (!existData.length) throw new BadRequest("List doesn't exist")

        if (!existData[0]?.dataValues?.list_movies.length) throw new BadRequest("List doesn't have any Series")


        const response = await List_movies.destroy({
            where : {
                list_id: listId,
                film_id: {
                    [Op.or]: films
                }
            }
        })

        if (response >= 1) {

            const cacheResults = await redisClient.lRange(`${idstring}`,0,100);
            if(cacheResults.length < 20) {
                    await redisClient.rPush(`${idstring}`,["You removed a serie from list "+ `${listId}`, `${date}` ]);
            }
        

            res.send({message: "Serie deleted"})


        } else {
            console.log(response)
            throw new BadRequest ("Serie not present at the database")
        }


    } catch (error) {

        next(error)
    }
}

const addFilm = async (req,res,next) => {

    const {listId,films} = req.body
    const {userId} = req
    const idstring = 'userid'+userId.toString()
    const date = new Date().toISOString()


    try {

        //check if films already exist on our db

        const filmIds = films.map((x)=> x.id)

        const existingFilms = await Film.findAll({
            where : {
                id : {
                    [Op.or] : filmIds
                }
            }
        })



        if (!existingFilms.length) {

            const response = films.map( async (film)=> {
                
                    return result = await List_movies.create({
                    list_id: listId,
                    film: film
                    
                    },{
                        include:[{
                            association : List_movies.Film
                        }]
                    })
                }
            )

            const resolved = await Promise.all(response)

            const cacheResults = await redisClient.lRange(`${idstring}`,0,100);
            if(cacheResults.length < 20) {
                    await redisClient.rPush(`${idstring}`,["You added a serie to list "+ `${listId}`, `${date}` ]);
            }
        

            res.send(resolved)

        } else {

            // const filmsId = existingFilms.map((film)=> film.id)

            // console.log(filmsId)

            const response = filmIds.map( async (film)=> {
                
                return result = await List_movies.create({
                list_id: listId,
                film_id: film
                
                })
            }
        )

        const resolved = await Promise.all(response)

        const cacheResults = await redisClient.lRange(`${idstring}`,0,100);
        if(cacheResults.length < 20) {
                await redisClient.rPush(`${idstring}`,["You added a serie to list "+ `${listId}`, `${date}` ]);
        }
    

        res.send(resolved)


        }
        
    } catch (error) {

        next(error)
        
    }
}

const removeList = async (req,res,next) => {

    const {id} = req.params
    const {userId} = req
    const idstring = 'userid'+userId.toString()
    const date = new Date().toISOString()

    try {

        const response = await List.destroy({
            where: {
                id: id
            }
        })

        if(response === 1) {

            const cacheResults = await redisClient.lRange(`${idstring}`,0,100);
            if(cacheResults.length < 20) {
                    await redisClient.rPush(`${idstring}`,["You delete list "+ `${id}`, `${date}` ]);
            }
        

        res.json({message: "List deleted"})

    } else {

        throw new BadRequest ("No List was found")
    }
        
    } catch (error) {

        next(error)

    }
}

const updateList = async(req,res,next) => {

    const {description, serieId} = req.body
    const {userId} = req
    const idstring = 'userid'+userId.toString()
    const date = new Date().toISOString()
    try {
        
        const response = await List.update({description:description},{
            where: {
                id: serieId,
                client_id: userId
            }
        })

        if(response[0] === 1) {
            
            const cacheResults = await redisClient.lRange(`${idstring}`,0,100);
            if(cacheResults.length < 20) {
                    await redisClient.rPush(`${idstring}`,["You updated list "+ `${serieId}`, `${date}` ]);
            }
            res.send({message : "List updated"})

        } else {
            throw new BadRequest ("List not found")
        }

    } catch (error) {

        next(error)
        
    }
}


module.exports = {
    getAll,
    createList,
    removeFilm,
    addFilm,
    getList,
    removeList,
    getUserLists,
    updateList
}

