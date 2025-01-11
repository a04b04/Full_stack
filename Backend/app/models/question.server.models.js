const db = require ('../../database')

const getEventid = (event_id, done) => {
    const sql = 'SELECT event_id FROM events WHERE event_id = ?';
    const params = [event_id];
    db.get(sql, params, (err, row) => {
        if (err){
            return done(err);   //database error
        }
        if(!row){
            return done(null, null);
        }
        return done(null,row.event_id);     //returns event_id
    })
}

const isRegistered = (event_id, user_id, done) => {
    const sql = 'SELECT COUNT (*) AS count FROM attendees WHERE event_id = ? AND user_id = ?';
    const params = [event_id, user_id]
    
    db.get(sql, params, (err, row)=> {
        if (err){
            return done(err);
        }
    
        if( row.count ===0 ){
            return done(null, false);
        }

        return done(null, true);        //user is registered 
        
    });
};




const askQuestion = (event_id, user_id, question, done) => {

    const isRegisteredsql = 'SELECT COUNT(*) AS count FROM attendees WHERE event_id = ? AND user_id = ?';
    db.get(isRegisteredsql, [event_id, user_id], (err, row) => {
        if (err){
            return done(err);
        }
    db.get(isRegisteredsql, [event_id, user_id],(err, row) => {
        if (err) {
            return done(err)
        }
        if(row.count === 0){
            return done
        }
    })
        

    })


}

module.exports = {
    askQuestion: askQuestion,
    getEventid:getEventid,
    isRegistered: isRegistered
}