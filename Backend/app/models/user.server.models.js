const crypto = require('crypto');
const db = require('../../database');   //locating the database
const { token } = require('morgan');

const getHash = function(password, salt){
    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
};      //password hashing function

//adding a user to the database
const adduser = (user, done) => {
    const salt = crypto.randomBytes(64);
    const hash = getHash(user.password, salt);
    //SQL query to inser the user's details into the table
    const sql = 'INSERT INTO users (first_name, last_name, email, password, salt) VALUES (?,?,?,?,?)'
    let values = [user.first_name, user.last_name, user.email, hash, salt.toString('hex')];

    //running the the sql query
    db.run('INSERT INTO users(first_name, last_name, email, password, salt) VALUES (?, ?, ?, ?,?)', values, function(err){
        if(err){
            return done(err);
        }
        return done(null, this.lastID);
    });
};

const authenticateUser = (email, password, done)=> {        //error
    const sql = 'SELECT user_id, password, salt FROM users WHERE email=?'
    db.get(sql, [email], (err, row)=> {
        if(err || row === undefined){
            return done(true)
        }
        else{
            if(row.user_salt == null){
                row.user_salt = '';
            }
                
            let salt = Buffer.from(row.salt,'hex');

            if(row.password === getHash(password, salt)){
                return done( null,row.user_id);
            }
            else{
                return done (true);
                }
            }
        //if(!row) return done(404) //if they type the wrong email

        //if (row.salt === null) row.salt = ''

        //let salt = Buffer.from(row.salt, 'hex')

        //if (row.password === getHash(password, salt)){
            //return done(false, row.user_id)
        //}else{
           // return done(404)
        //}
    })
}

const checkAuthenticated = function(req, res, next){        
    let token = req.get('X-Authorization');

    users.getIdFromToken(token, (err,id) => {
        if (err || id == null){
            return res.sendStatus(401);
        }
        next();
    });
};

const getToken = (id, done) => {        
    const sql = 'SELECT session_token FROM users WHERE user_id = ?';

    db.get(sql, [id], (err, row)=> {
        if(err || !row){
            return done(true, null);
        }
        //if(row && row.session_token){
          //  return done (null, row.session_token)
        //}
        else{
            return done (null, row.session_token);
        }
    })
}

const setToken = (id, done) => {        
    let token = crypto.randomBytes(16).toString('hex');
    const sql = 'UPDATE users SET session_token=? WHERE user_id =?'

    db.run(sql, [token, id], (err)=> {
        if(err){
            return done(err);
        }
        return done(null, token);
    })
}

const removeToken = (token, done) =>{
    const sql = 'UPDATE users SET session_token=null WHERE session_token=?'

    db.run(sql, [token], (err) => {

        return done(err)
    })
}

const getIdFromToken = (token, done) => {

    const sql = 'SELECT user_id FROM users WHERE session_token=?';

    db.get(sql, [token], function(err, row) {
        if(err || !row){
            return done(true, null);
        }
        //if(row && row.id){
          //  return done (null, row.id)
        //}
        else{
            return done (null, row.user_id);
        }
    })
}



module.exports = {
    adduser: adduser,
    checkAuthenticated: checkAuthenticated,
    authenticateUser: authenticateUser,
    getToken: getToken,
    setToken: setToken,
    removeToken: removeToken,
    getIdFromToken: getIdFromToken
}
