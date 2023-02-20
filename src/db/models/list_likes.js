const {pool} = require('../index.js')
const Sequelize = require('sequelize');


const List_likes = pool.define('list_likes', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    list_id: {
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
},{
    timestamps: false,
    tableName: 'list_likes'
})


module.exports = {
    List_likes
}