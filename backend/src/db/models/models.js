const {Review} = require ('./review.js')
const {Film} = require ('./film.js')
const {Connection} = require ('./connection.js')
const {Likes} = require ('./likes.js')
const {Watchlist} = require ('./watchlist.js')
const {User} = require ('./user.js')
const {Token} = require('./resetToken.js')
const {List} = require('./list.js')
const {List_movies} = require('./list_movies.js')
const {List_likes} = require('./list_likes.js')
const {Film_likes} = require ('./film_likes.js')


User.Lists = User.hasMany(List, { foreignKey: 'client_id' })
List.User = List.belongsTo(User, { foreignKey: 'client_id' })
Film.List_movies = Film.hasMany(List_movies, {foreignKey: 'film_id'})
List_movies.Film = List_movies.belongsTo(Film, {foreignKey: 'film_id'})
List.List_movies = List.hasMany(List_movies, {foreignKey: 'list_id'})
List_movies.List = List_movies.belongsTo(List, {foreignKey: 'list_id'})
User.List_likes= User.hasMany(List_likes, {foreignKey: 'client_id'})
List_likes.User= List_likes.belongsTo(User,{foreignKey: 'client_id'})
List.List_likes = List.hasMany(List_likes,{foreignKey:'list_id'})
List_likes.List = List_likes.belongsTo(List, {foreignKey: 'list_id'})

User.Film_likes= User.hasMany(Film_likes, {foreignKey: 'client_id'})
Film_likes.User= Film_likes.belongsTo(User,{foreignKey: 'client_id'})
Film.Film_likes = Film.hasMany(Film_likes,{foreignKey:'film_id'})
Film_likes.Film = Film_likes.belongsTo(Film, {foreignKey: 'film_id'})



module.exports = {
    Review,
    Film,
    Connection,
    Likes,
    Watchlist,
    User,
    Token,
    List,
    List_movies,
    List_likes,
    Film_likes

}

