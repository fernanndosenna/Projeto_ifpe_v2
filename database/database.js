const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas', 'fernando', 'Hertz94773195',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports =connection;