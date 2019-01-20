path = require('path');
var jwt = require('jwt-simple');
var security_key = require('../Config/security_key');
var User = require('../models/users');


exports.authenticateApi = function(req, res, next) {
    var token = getToken(req.headers);
    console.log(token);
    if (token) {
        try {
            var decoded = jwt.decode(token, security_key.secret);
            console.log(decoded);
            User.findOne({
                'email': decoded.User.email
            }, function(err, user) {
                if (!user) {
                    return res.status(451).send({ error: { message: 'Invalid token' } });
                } else {
                    req.decode = decoded;
                    next();
                }
            });
        } catch (e) {
            return res.status(451).send({
                error: { message: 'Invalid token' }
            });
        }
    } else {
        return res.status(451).send({ error: { message: 'No token provided.please pass valid token in header' } });
    }
}
exports.OnlyAccesByAdmin = function(req, res, next) {
    var role = req.decode.Users.role;
    if (role && role == 1) {
        next();
    } else {
        return res.status(451).send({ error: { message: 'No Authorization' } });
    }
};

/**
 * @author Rupesh
 * @param {type} headers
 * @returns {nm$_AuthController.getToken.parted}
 */
getToken = function(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2 && parted[0] == 'Jloyds') {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
}