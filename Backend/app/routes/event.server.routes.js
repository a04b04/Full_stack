const eventServerControllers = require("../controllers/event.server.controllers.js");
//const event = require("../controllers/user.server.controllers")
const auth = require("../lib/authentication")

module.exports = function(app){
    app.route("/events")
    .post(eventServerControllers.createEvent); //referencing create event in controller

    app.route("/events/:event_id")
    .get(eventServerControllers.getEvent)
    .patch(eventServerControllers.updateEvent)
    .delete(eventServerControllers.deleteEvent);

    
    

    app.route("/search")
    .get(eventServerControllers.searchEvent);

}