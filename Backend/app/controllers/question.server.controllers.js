const Joi = require("joi");

const askQuestion = (req, res) => {
    const schema = Joi.object({
        question: Joi.string().required()
    })
    const{error} = schema.validate(req.body);
    if(error) {return res.status(400).send({error_message: "check user information"});}
    else{return res.status(201)}
    //return res.sendStatus(500);
}

const deleteQuestion = (req, res) => {
    return res.sendStatus(500);
}

const upvoteQuestion = (req, res) => {
    return res.sendStatus(500);
}

const downvoteQuestion = (req, res) => {
    return res.sendStatus(500);
}

module.exports = {
    askQuestion: askQuestion,
    deleteQuestion: deleteQuestion,
    upvoteQuestion: upvoteQuestion,
    downvoteQuestion: downvoteQuestion
}
