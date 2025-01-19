const Joi = require("joi");
//const { object } = require("joi");
const events = require('../models/event.server.models');
const userServerModels = require('../models/user.server.models');


const createEvent = (req, res) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.number().required(),
        start: Joi.number().required(),
        close_registration: Joi.number().required(),
        max_attendees: Joi.number().required()
    })

    let event = Object.assign({}, req.body);

    let{error} = function(event){
        if(schema.validate(event).error){
            return{error: schema.validate(event).error};
        }else{
            return {error: null};
        }
    };

    if(error){
        return res.status(401).send({error_message: "check user information"});
    }
    //let date = Date.now();
    //if(req.body.start <= date){
      //  return res.status(401).send({error_message: "Event start time must be in the future"})      //changed this above and below to 400 was 401
    //}
    //if(req.body.start <= req.body.close_registration){
    //    return res.status(401).send({error_message: "Registration must close before the start date"})
    //}
    
    
    else{
        events.addNewEvent(event,(err,id) =>{
            if(err){
                //console.log(err)
                return res.status(400).send({error_message: err.message});
            }else{
                return res.status(201).send({event_id: id});
            }
    
        })
    }   //return res.sendStatus(500);
}

const getEvent = (req, res) => {        //need to add sommat
    let token = req.get('X-Authorization');

userServerModels.getIdFromToken(token, (err, id) =>{
    if(err || id ===null){
        console.log("User is not authenticated");
    }
    events.getEventDetails(event_id,id, (err, result)=>{
        if(err ===404)return res.sendStatus(404);
        if(err) return res.sendStatus(500);
        return res.status(200).send(result);
    })
    
})
}

const updateEvent = (req, res) => {
        const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        start: Joi.number().required(),
        close_registration: Joi.number().required(),
        max_attendees: Joi.number().required()
    })
    const{error} = schema.validate(req.body);
    if(error) {return res.status(400).send({error_message: "check user information"});}
    else{return res.status(201)}
    //return res.sendStatus(500);
}

const AttendEvent = (req, res) => {
    const {event_id, user_id} = req.body;

      isRegistered(event_id,user_id, (err, registered) =>{
            if (err){
                return res.status(500).send({error_message: 'Error checking registration status'});
            }
            if (registered){
                return res.status(403).send({error_message: 'You are already registered'});
            }
            isArchived(event_id, (err, archived)=>{
                if(err){
                    return res.status(500).send ({error_message: 'Error checking event status '})
                }
                if (archived){
                    return res.status(403).send({error_message: 'Registration is closed'})
                }
                events.capacity(event_id, (err, atCapacity)=> {
                    if (err){
                        return res.status(500).send({message: 'Error checking event capcity'})
                    }
                    if(atCapacity == true) {
                        return res.status(403).send({message: 'Event is at capacity'});
                    }
                    events.AttendEvent(event_id, user_id, (err, result) =>{
                        if (err) {
                            return res.status(500).send({error_message: 'Error registering for the event'})
                        }
    
                        return res.status(result.status).send({message: 'User successfully registered for the event'})
                    })
                })
                
            })
        })
};

const deleteEvent = (req, res) => {
    let token = req.get("X-Authorization");
    const event_id = req.params.event_id;

   events.getCreatorID(event_id, (err, creator_id) => {
    if(err) {
        return res.sendStatus(500)      //server error
    }
    if(!creator_id) {
        return res.sendStatus(404)  //not found 
    }
    userServerModels.getIdFromToken(token, (err, creator_id)=> {
        if(err || user_id === null){
            return res.sendStatus(401);     //unauthorised
        }
        if(user_id != creator_id){
            return res.sendStatus(403)  //You can only delete your own events
        }
        events.deleteEvent(event_id, (err) =>{
            if(err){
                return res.sendStatus(500)  //Server not found 
            }
            return res.sendStatus(200); //OK
        })
    })
   })
    
}



/*const searchEvent = (req, res) => {

    const filters = {
        q: req.query.q || null,
        status: req.query.status || null,
        limit: parseInt(req.query.limit, 10) || 20, 
        offset: parseInt(req.query.offset, 10) || 0, 
    };

    
    const validStatuses = ['MY_EVENTS', 'ATTENDING', 'OPEN', 'ARCHIVE'];
    if (filters.status && !validStatuses.includes(filters.status)) {
        return res.status(400).send({ error_message: "Invalid status value" });
    }

    
    let token = req.get('X-Authorization');
    
    if (filters.status === 'MY_EVENTS' || filters.status === 'ATTENDING') {
        userServerModels.getIdFromToken(token, (err, user_id) => {
            if (err || !user_id) {
                return res.status(401).send({ error_message: "Invalid or missing token" });
            }

            filters.user_id = user_id; 
            performSearch(filters, res);
        });
    } else {
        performSearch(filters, res);
    }
};
*/


//const performSearch = (filters, res) => {
  //  events.searchEvent(filters, (err, results) => {
  //      if (err) {
  //          return res.status(500).send({ error_message: "An error occurred during the search" });
  /*      }
        if (results.length === 0) {
            return res.status(404).send({ error_message: "No events found" });
        }
        return res.status(200).send(results);
    });

    //return res.sendStatus(500);
}*/


const searchEvent = (req, res) => {
    events.search((err, rows) => {
        if(err){
            return res.status(400).send({error_message: err});
        }else{
            return res.status(200).json(rows.slice(0,20));
        }
    })
}





module.exports = {
    createEvent: createEvent,
    getEvent: getEvent,
    updateEvent: updateEvent,
    AttendEvent: AttendEvent,
    deleteEvent: deleteEvent,
    searchEvent: searchEvent,
    
}


