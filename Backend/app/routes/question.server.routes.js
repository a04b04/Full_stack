const question = require("../controllers/question.server.controllers")


module.exports = function(app){

    app.route("/event/:event_id/question")
    .post(question.askQuestion);

    app.route("/question/:question_id")
    .delete(question.deleteQuestion);

    app.route("/question/:question_id/vote")
    .post(question.upvoteQuestion);

    app.route("/question/:question_id/vote")
    .delete(question.downvoteQuestion);


}