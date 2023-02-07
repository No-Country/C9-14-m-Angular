const {pool} = require('../index.js')
const Sequelize = require('sequelize');


const Watchlist = ('watchlist', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    film_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    client_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    created_at : {
        type:Sequelize.DATE,
        allowNull:false
    },
    updated_at : {
        type:Sequelize.DATE,
        allowNull:false
    }
});


module.exports = {
    Watchlist
}