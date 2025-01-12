const Joi = require("joi");
const users = require("../models/user.server.models");

const crypto = require("crypto");

const db = require("../../database");
const { token } = require("morgan");

const create_account = (req, res) => {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().required(),
        password:Joi.string().min(6).max(30).pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@$%^&*(),.?":{}|<>]).+$/).required()
    });
    const{error} = schema.validate(req.body);
    if(error) {return res.status(400).send({error_message: "check user information"});}

    let user = Object.assign({}, req.body);
    users.adduser(user,(err, id) =>{
        if (err) return res.status(400).send({error_message: "check user information"})
        else{return res.status(201).send({user_id: id})}
         //return res.sendStatus(500);

    })
}



const login = (req, res) =>{
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
    const{error} = schema.validate(req.body);
    if(error){return res.status(400).send({error_message: "check user information"});}

    users.authenticateUser(req.body.email, req.body.password, (err, id)=>{
        
        if(err === 404) return res.status(400).send({error_message: "Invalid email/passoword supplied"});
        if (err) return res.sendStatus(500)

        users.getToken(id, (err, token) => {
            if (err) return res.sendStatus(500)
            
            if(token){
                return res.status(200).send({user_id: id, session_token:token})
            }else{
                users.setToken(id, (err, token) => {
                    if (err) return res.sendStatus(500)
                    return res.status(200).send({user_id: id, session_token: token});
                });
            }
        });
    })
    
}

const logout = (req, res) => {          //need to complete the logout function still 
    const token = req.get("X-Authorization")


    users.removeToken(token, function(err){
        if(err){
            return res.sendStatus(500);
        }
        else{
            return res.sendStatus(200);
        }
    });
    return null;
}


module.exports = {
    create_account: create_account,
    login: login,
    logout: logout
}
