const {pool} = require('../index.js')
const Sequelize = require('sequelize');


const Film = pool.define('film', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
      },
    year: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    poster_path : {
        type: Sequelize.STRING
    },
    backdrop_path : {
        type : Sequelize.STRING
    },
    created_at : {
        type:Sequelize.DATE,
    },
    updated_at : {
        type:Sequelize.DATE,
    }
},{
    timestamps: false,
    tableName: 'film'
});

  module.exports = {
    Film
  }