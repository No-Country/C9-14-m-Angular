const {pool} = require('../index.js')
const Sequelize = require('sequelize');
const { User } = require('./user.js');


const List = pool.define('list', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description : {
        type : Sequelize.STRING,
        allowNull: false,  
    },
    client_id : {
        type : Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id',
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
    tableName: 'list'
});


module.exports = {
    List
}