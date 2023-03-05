const {pool} = require('../index.js')
const Sequelize = require('sequelize');


const Token = pool.define('password_reset_tokens', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: Sequelize.STRING,
        allowNull:false
    },
    client_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    created_at : {
        type:Sequelize.DATE,
        allowNull:false
    },
    expires_at : {
        type:Sequelize.DATE,
        allowNull:false
    }
},{
    timestamps: false,
    tableName: 'password_reset_tokens'
});


module.exports = {
    Token
}