var {User} = require('../models/user');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');  // get jwt token from the header

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        req.user = user;
        req.token = token;
        next();    // to allow the code below to execute
    }).catch((e) => {
        res.status(401).send();
    });
};

module.exports = {authenticate};