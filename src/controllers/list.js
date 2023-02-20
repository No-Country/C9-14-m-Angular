const {List,List_likes,List_movies, User, Film, ListListMovies, ListMoviesFilm} = require('../db/models/models')
const {ServerConnection,Api404Error,BadRequest} = require('../errors/errors.js')
const { Op } = require("sequelize");

const getAll = async (req,res) => {

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

    if (error?.statusCode) {

        res.status(error.statusCode).send({message: error.name})

    } else {

        const error = new ServerConnection("Connetion to server failed. Please try again in a few seconds")

        res.status(error.statusCode).send({message: error.name})
    }
    
}
     
}

const getList = async(req,res) => {

    const {id} = req.params

    try {
        const response = await List_movies.findAll({
            where: {
                list_id : id
            }
        })

        const result = response.map((x)=> x.dataValues)

        if (!result.length) throw new BadRequest ("Non existing List")

        res.send(result)

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

const createList = async (req,res) => {

    const {userId, description,films} = req.body

    try {

        const filmtitles = films.map((x)=> x.title)

        const existingFilms = await Film.findAll({
            where : {
                title : {
                    [Op.or] : filmtitles
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
            const filmsId = existingFilms.map((film)=> film.id)
            const response = await List.create({
                description,
                client_id: userId,
                list_movies : filmsId.map((film)=> ({
                    film_id: film
                }))
            }, {
                include: [{
                  association: List.List_movies,
                }]
              });
              res.send(response)

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

//we tested considering a manual creation and with the series selected in that moment
// I need to add the list creation whenever the user clicks on fav or like. So I need to grab that original list
// and create a new one with that information. Therefore, the user can start updating it because its him's



const removeFilm = async (req,res) => {

    const {listId, films} = req.body
 
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

        res.json(response)

    } catch (error) {

        if (error?.statusCode) {

            res.status(error.statusCode).send({message: error.name})
    
        } else {
    
            const error = new ServerConnection("Connetion to server failed. Please try again in a few seconds")
    
            res.status(error.statusCode).send({message: error.name})
        }
        
    }
}

const addFilm = async (req,res) => {

    const {listId,films} = req.body
    try {

        //check if films already exist on our db

        const filmtitles = films.map((x)=> x.title)

        const existingFilms = await Film.findAll({
            where : {
                title : {
                    [Op.or] : filmtitles
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

            res.send(resolved)

        } else {

            const filmsId = existingFilms.map((film)=> film.id)

            console.log(filmsId)

            const response = filmsId.map( async (film)=> {
                
                return result = await List_movies.create({
                list_id: listId,
                film_id: film
                
                })
            }
        )

        const resolved = await Promise.all(response)

        res.send(resolved)


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

const removeList = async (req,res) => {

    const {id} = req.params

    try {

        const response = await List.destroy({
            where: {
                id: id
            }
        })

        res.json(response)
        
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
    getAll,
    createList,
    removeFilm,
    addFilm,
    getList,
    removeList
}


