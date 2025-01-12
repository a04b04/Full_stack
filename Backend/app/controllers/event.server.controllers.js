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
    const{error} = schema.validate(req.body);
    if(error) {return res.status(401).send({error_message: "check user information"});}
    let date = Date.now();
    if(req.body.start <= date){
        return res.status(401).send({error_message: "Event start time must be in the future"})
    }
    if(req.body.start <= req.body.close_registration){
        return res.status(401).send({error_message: "Registration must close before the start date"})
    }
    
    events.addNewEvent(req.body, req.user_id,(err,id) =>{
        if(err){
            //console.log(err)
            return res.sendStatus(500);
        } else{
            return res.status(201).send({event_id: id});
        }
    
    })

    //return res.sendStatus(500);
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



const searchEvent = (req, res) => {
    return res.sendStatus(500);
}






module.exports = {
    createEvent: createEvent,
    getEvent: getEvent,
    updateEvent: updateEvent,
    AttendEvent: AttendEvent,
    deleteEvent: deleteEvent,
    searchEvent: searchEvent
}


