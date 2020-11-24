const Sequelize = require('sequelize')
const connection = require('./database')

const Usuario = connection.define('usuarios',{
    nome:{
        type: Sequelize.STRING,
        allowNull:false
    },
    email:{
        type: Sequelize.STRING,
        allowNull:false
    },
    eAdmin: {
        type: Sequelize.NUMBER,
        default: 0
    },
    senha:{
        type: Sequelize.STRING,
        allowNull:false
    }
})

Usuario.sync({force:false}).then(() =>{
    console.log("Tabela criada")
})

module.exports = Usuario;