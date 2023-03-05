const {pool} = require('../index.js')
const Sequelize = require('sequelize');


const Connection = pool.define('connection', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    follower_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    followed_id: {
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
    tableName: 'connection'
});


module.exports = {
    Connection
}