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


User.Lists = User.hasMany(List, { foreignKey: 'client_id' })
List.User = List.belongsTo(User, { foreignKey: 'client_id' })
Film.List_movies = Film.hasMany(List_movies, {foreignKey: 'film_id'})
List_movies.Film = List_movies.belongsTo(Film, {foreignKey: 'film_id'})
List.List_movies = List.hasMany(List_movies, {foreignKey: 'list_id'})
List_movies.List = List_movies.belongsTo(List, {foreignKey: 'list_id'})



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

}

