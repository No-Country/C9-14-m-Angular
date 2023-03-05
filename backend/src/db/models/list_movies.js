const {pool} = require('../index.js')
const Sequelize = require('sequelize');
const { List } = require('./list.js');
const { Film } = require('./film.js');


const List_movies = pool.define('list_movies', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    list_id : {
        type : Sequelize.INTEGER,
        references: {
            model : List,
            key: 'id'
        }
    },
    film_id: {
        type: Sequelize.INTEGER,
        references: {
            model : Film,
            key: 'id'
        }
    },
    created_at : {
        type:Sequelize.DATE,
    },
    updated_at : {
        type:Sequelize.DATE,
    }
},{
    timestamps: false,
    tableName: 'list_movies'
});


module.exports = {
    List_movies
}