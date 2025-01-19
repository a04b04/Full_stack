const { func } = require('joi');
const db = require('../../database');
//const eventServerControllers = require('../controllers/event.server.controllers');

const addNewEvent = (event, done) => {
    const sql = 'INSERT INTO events (name, description, location, start_date, close_registration, max_attendees, creator_id) VALUES (?, ?, ?, ?, ? ,?, ?)'
    const values= [event.name, event.description, event.location, event.start, event.close_registration, event.max_attendees, event.creator_id];

    db.run(sql, values, function(err){
        if(err){
            return done(err);
        }
        return done(null, this.lastID);
    });
}

const getEventDetails = (event_id, user_id, done)=>{
    const sql = 'SELECT '+
    'e.event_id, ' +        //stuff from the events table + using e as its having issues with joining i think
    'e.name, ' +
    'e.description, ' +
    'e.location, ' +
    'e.start_date AS start, ' +
    'e.close_registration, ' +
    'e.max_attendees, ' +
    'u.user_id AS creator_id, ' +
    'u.first_name, '+       //getting data from the users table
    'u.last_name, ' +
    'u.email ' +
    'FROM events e ' +
    'JOIN users u ON e.creator_id = u.user_id ' + 
    'WHERE e.event_id = ?;';
    const params = [event_id]; //?
    db.get(sql, params, (err,row) =>{
        if (err) {
            return done(err);
        }
        return done(null, row);
    });
};      //Not sure how to do the extending bit of part3 lab 6   gave up need to go back over 

const deleteEvent = (event_id, done )=> {
    const sql = ' UPDATE events SET close_registration = -1 WHERE event_id = ?';
    const params = [event_id];      //defines an array 
    db.run(sql, params, function(err){      //runs the sql with params and function err is executed whe nthe code has been run
        if (err) {
            return done(err);
        }
        return done (null);
    });
};

const getCreatorID = (event_id, done) => {
    const sql = 'SELECT creator_id FROM events WHERE event_id = ?';
    const params = [event_id];

    db.get(sql, params, (err, row) =>{
        if (err){
            return done(err);
        }
        if (!row){
            return done(null, null);
        }
        return done(null, row.creator_id);
    })
}




const updateEvent = (event_id, newDetails, done) =>{
    const sql = 'UPDATE events SET name = ?, description = ?, location = ?, start_date = ?, close_registration = ?, max_attendees = ? WHERE event_id = ?'
    const params =[
        newDetails.name,
        newDetails.description,
        newDetails.location,
        newDetails.start_date,
        newDetails.close_registration,
        newDetails.max_attendees,
        event_id
    ];
    db.run(sql, params, function(err){
        if (err){
            return done(err);
        }
        return done(null, {message: "Event updated successfully"});
    })
}

const isRegistered = (event_id, user_id, done) => {
    const sql = 'SELECT COUNT (*) AS count FROM attendees WHERE event_id = ? AND user_id = ? ';
    const params = [event_id, user_id];
     db.get(sql, params, (err,row)=>{
        if (err){
            return done(err);
        }
        if(row.count> 0){

            return done (null, true, );         //if they are already registered 
        }
        return done(null, false)
     })
}

const isArchived = (close_registration, done) =>{
    const sql = 'SELECT close_registartion FROM events'
    const params = [close_registration];
    db.run(sql, params, function(err){
        if (err) {
            return done (err);
        }
        if(close_registration === -1){
            return done (null,true, ' registration is closed' )
        }
    })
}

const capacity = (event_id, done) =>{
    const sql = 'COUNT(a.user_id) AS current_attendees, e.max_attendees FROM events e LEFT JOIN attendees a ON e.event_id = a.event_id WHERE e.event_id = ? GROUP  BY e.event_id, e.max_attendees';
    const params = [event_id];
    db.get (sql, params, (err, row) =>{
        if(err){
            return done(err);
        }
        if(!row){
            return done(null, {atCapacity: false})
        }

        if(row.user_id >= row.max_attendees){
            return done(null, {atCapacity: true});
        }
        return done(null, {atCapacity: false})

    })


}


const AttendEvent = (event_id, user_id, done) => {
            const sql = 'INSERT INTO attendees (event_id,user_id) VALUES(?, ?)';

            const params = [event_id, user_id];

            db.run(sql, params, function(err){
                if (err){
                    return done (err);
                }
                return done(null)
            })
        }


//const searchEvent = (filters, done) => {
  //  const searchEvent = (filters, done) => {
  //  let sql = 'SELECT e.event_id, e.name, e.description, e.location, e.start_date AS start, e.close_registration, e.max_attendees, u.user_id, u.first_name, u.last_name, u.email FROM events e JOIN users u ON e.creator_id = u.user_id LEFT JOIN attendees a ON e.event_id = a.event_id WHERE 1=1';
  //  const params = [];

  //  if (filters.q) {
  //      sql += ' AND e.name LIKE ?';
  //      params.push(`%${filters.q}%`);
  //  }

  //  if (filters.status) {
  //      if (filters.status === 'MY_EVENTS') {
  //          sql += ' AND e.creator_id = ?';
  //          params.push(filters.user_id);
  //      } else if (filters.status === 'ATTENDING') {
  //          sql += ' AND a.user_id = ?';
  //          params.push(filters.user_id);
  //      } else if (filters.status === 'OPEN') {
  //          sql += ' AND e.close_registration > strftime("%s", "now")';
  //      } else if (filters.status === 'ARCHIVE') {
  //          sql += ' AND e.close_registration <= strftime("%s", "now")';
  //      }
  //  }

  //  const limit = filters.limit || 20;
  //  const offset = filters.offset || 0;
  //  sql += ' LIMIT ? OFFSET ?';
  //  params.push(limit, offset);

  //  db.all(sql, params, (err, rows) => {
  //      if (err) {
  //          return done(err);
  //      }
  //      return done(null, rows);
  //  });
//};
    
//}



const search = function(done) {     //above is the code trying to do it so it matches the spec but it does not work so i just did return all events
    db.all('SELECT * FROM events', function(err,rows){
        if(err){
            return done(err, null);
        }
        return done(null, rows);
    });
};

module.exports = {
    addNewEvent: addNewEvent,
    getEventDetails: getEventDetails,
    deleteEvent: deleteEvent,
    updateEvent: updateEvent,
    isRegistered: isRegistered,
    AttendEvent: AttendEvent,
    isArchived: isArchived,
    capacity: capacity,
    getCreatorID:  getCreatorID,
    search: search
}