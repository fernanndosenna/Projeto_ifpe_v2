const Boom = require("boom")
const Validator = require("fastest-validator")
const jwt = require("jsonwebtoken")

const services = require("./services")

const v = new Validator()

module.exports = {
    auth: async ctx => {
        const { request: { body }, response } = ctx


        const schema = {
            email: {max: 255, min: 5, type: 'string'},
            password: {max:16, min: 8, type: 'string'}
        }
        const erros = v.validate(body,schema);

        if(Array.isArray(erros) && erros.length){
            response.status = 400
           return response.body = Boom.badRequest(null, erros)
        }

        const user = await services.auth(body)
        if(user){
            response.body = {
                result: jwt.sign({email: user.email}, 'meusegredo')
            } 
        }else{
            response.status = 401
            response.body = { result: Boom.unauthorized()}
        }
    }
}