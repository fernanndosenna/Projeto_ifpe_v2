const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta')//tabela de pergunta
//Database
const Resposta = require("./database/Resposta")

connection.authenticate()
           .then(()=>{
                console.log('Conexão feita com o banco de dados')
           })
           .catch((msgErro)=>{
                console.log(msgErro)
           })  
//******configuraçoes**********//
//ejs estou dizendo para o express usar o EJS como view enginer
app.set('view engine', 'ejs');
//arquivos estaticos
app.use(express.static('public'));
//body-parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

//***********ROTAS**************** */
app.get("/",(req,res)=>{
    res.render("index")
})

app.get('/suporte',(req,res)=>{//rota principal recebendo os dados do banco para lista-las
    Pergunta.findAll({raw: true, order:[
        ['id', 'DESC']        
    ]}).then((perguntas)=>{
        res.render('index2',{
            perguntas: perguntas
        });
    })
});

app.get('/perguntar', (req,res)=>{
    res.render('perguntar');
})

app.post("/salvarpergunta",(req,res)=>{//receber dados do formulario
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect('/');
    })
});

app.get('/pergunta/:id',(req,res)=>{//buscando o id de cada pergunta
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then((pergunta)=>{//carrega uma pergunta
        if(pergunta != undefined){//pergunta achada

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ['id', 'DESC']
                ]
            }).then((respostas)=>{ //carrega a resposta da pergunta

                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
                })
            })
       
        }else{//não encontrada
            res.redirect('/')
        }
    })
})

app.post("/responder", (req,res)=>{ //receber as respostas do formulario sincronizada com cada id da pergunta
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect("/pergunta/" + perguntaId);
    })
})


app.listen(8080,()=>{
    console.log('App rodando na porta 8080')
})



