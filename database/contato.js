const Sequelize = require('sequelize');
const connection = require('./database')

const Contato = connection.define('Contato', {
    PrimeiroNome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    UltimoNome:{
        type: Sequelize.STRING,
        allowNull: false
    }, 
    Cidade: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Estado:{
        type: Sequelize.STRING,
    },
    CEP:{
        type: Sequelize.STRING,
        allowNull: false
    },
    Email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Mensagem:{
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Contato.sync({force: false}).then(()=>{
    console.log('Tabela criada!')
})

module.exports = Contato;