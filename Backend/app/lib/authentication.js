const users = require('../models/user.server.models');

const isAuthenticated = (req, res, next) => {
    let token = req.get('X-Authorization');
    if (!token) {
        return res.status(401).send({ error_message: "Missing authentication token" });
    }

    users.getIdFromToken(token, (err, id)=> {
        if (err || id === null) {
            return res.sendStatus(401);
        }
        req.userId = id;
        next();
    })

}

module.exports = {
    isAuthenticated: isAuthenticated
}