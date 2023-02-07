const {pool} = require('../index.js')
const Sequelize = require('sequelize');


const Likes = ('likes', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    review_id: {
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
})


module.exports = {
    Likes
}