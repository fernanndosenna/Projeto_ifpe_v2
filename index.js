const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta')//tabela de pergunta
//Database
const Resposta = require("./database/Resposta")
const Contato = require("./database/contato")
const Usuario = require("./database/Usuario")
const bcrypt = require("bcryptjs")


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

app.get('/contato', (req,res)=>{ //rota de contato
    res.render('contato')
})


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
        res.redirect('/suporte');
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
app.post("/salvarcontato", (req,res)=>{ //receber dados do formulario de contato
    var PrimeiroNome = req.body.Pnome;
    var UltimoNome = req.body.Unome;
    var Cidade = req.body.Cidade;
    var Estado = req.body.Estado;
    var CEP = req.body.CEP;
    var Email = req.body.Email;
    var Mensagem = req.body.Mensagem;
    Contato.create({
        PrimeiroNome: PrimeiroNome,
        UltimoNome: UltimoNome,
        Cidade: Cidade,
        Estado: Estado,
        CEP: CEP,
        Email: Email,
        Mensagem:Mensagem        
        
    }).then(()=>{
        res.send("Seus dados e mensagens ja foram enviadas, aguarde o nosso retorno!")        
    }).catch((err)=>{
        console.log(err)
    })
})

app.get("/registro", (req,res)=>{ //renderizando um formulario de registro
    res.render('usuarios/registro')
})

app.post("/registro", (req,res)=>{
    Usuario.findOne({email: req.body.email}).then((usuario)=>{
        if(usuario){
            console.log("Email já existe")
            res.redirect("/registro")
        }else{
        
            Usuario.create({
                nome: req.body.nome,
                email: req.body.email,
                senha: req.body.senha
            })


        }
    }).catch((err)=>{
        console.log(err)
        res.redirect("/")
    })
})


app.listen(8080,()=>{
    console.log('App rodando na porta 8080')
})



