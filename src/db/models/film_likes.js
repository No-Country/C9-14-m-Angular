const {pool} = require('../index.js')
const Sequelize = require('sequelize');
const { User } = require('./user.js');
const { Film } = require('./film.js');


const Film_likes = pool.define('film_likes', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    film_id: {
        type: Sequelize.INTEGER,
        references: {
            model : Film,
            key: 'id'
        }

    },
    client_id: {
        type: Sequelize.INTEGER,
        references: {
            model : User,
            key: 'id'
        }
    },
    created_at : {
        type:Sequelize.DATE,
        allowNull:false
    },
    updated_at : {
        type:Sequelize.DATE,
        allowNull:false
    }
},{
    timestamps: false,
    tableName: 'film_likes'
})


module.exports = {
    Film_likes
}