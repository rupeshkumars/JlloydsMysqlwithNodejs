var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var security_key = require('../Config/security_key');

/***********************************Model Invoke*********************************/
const Users = db.users;

/**********************************Email Configuration********************************/

/************************************Email Templates***********************************/

/***
 * @author Rupesh Kumar Sharma
 * @param {type} req
 * @param {type} res
 */
exports.userRegistrations = function(req, res) {
    try {
        var request = req.body;
        exports.validateUsersCreat(request, function(err) {
            console.log(err);
            if (err) {
                console.log('1');
                res.status(400).send({ error: err })
            } else {

                var password = Users.prototype.generateHash(req.body.password)
                password.then(function(password) {
                    console.log(password) //will log results.
                    Users.create({
                        firstName: request.firstName,
                        lastName: request.lastName,
                        email: request.email,
                        companyName: request.companyName,
                        licenseStartDate: request.licenseStartDate,
                        licenseEndDate: request.licenseEndDate,
                        password: password,
                        role: request.role
                    }).then(Users => {
                        var encript_Data = {
                            "expiresIn": Date.now() + (3600),
                            "Users": Users
                        }
                        var token = jwt.encode(encript_Data, security_key.secret);
                        var data = {
                            token: 'Jloyds ' + token,
                            expiresIn: 3600, //expiration time of 1 hr
                            Users: Users
                        };
                        // Send created user to client
                        res.status(200).send({ data })
                    }).catch(function(err) {
                        // print the error details
                        res.status(400).send({ error: err })
                    });
                })
            }
        })

        // res.status(200).send({ data: {} })
    } catch (err) {
        res.status(400).send({ error: err })
    }


};
exports.validateUsersCreat = function(data, cb) {
    var message = {};
    try {

        if (!data.firstName || data.firstName == "") {
            message.firstName = "firstName should not empty"
        }
        if (!data.lastName || data.lastName == "") {
            message.lastName = "lastName should not empty"
        }
        if (!data.companyName || data.companyName == "") {
            message.companyName = "companyName should not empty"
        }
        if (!data.password || data.password == "") {
            message.password = "password should not empty"
        }
        if (!data.email || data.email == "") {
            message.email = "email should not empty"
        }
        if (!data.role || data.role == "") {
            message.role = "role should not empty"
        }
        console.log(Object.keys(message).length);
        if (message && Object.keys(message).length > 0) {
            cb(message);
        } else {
            cb(null);
        }


    } catch (err) {
        cb(err);
    }

}
exports.ValidateCompanyName = function(req, res) {
    try {
        if (req.body.companyName && req.body.companyName != "") {
            Users.findOne({
                where: { companyName: req.body.companyName, company_license: 1 }
            }).then(Users => {
                if (Users) {
                    console.log(Users);
                    res.status(200).send({ status: "success" })
                } else {
                    console.log(Users);
                    res.status(200).send({ status: false })
                }
                console.log(Users);
                // project will be the first entry of the Projects table with the title 'aProject' || null
                // project.title will contain the name of the project
            }).catch(function(err) {
                // print the error details
                res.status(400).send({ error: err })
            });
        } else {
            res.status(400).send({ error: { 'companyName': "not empty" } })
        }

    } catch (err) {
        res.status(400).send({ error: err })
    }
}
exports.listofcompanies = function(res, res) {
    try {
        Users.findAll({
            where: {
                'role': 2
            },
            attributes: ['firstName', 'lastName', 'email', 'companyName', 'licenseStartDate', 'licenseEndDate', 'company_license'],
            order: [
                ['createdAt', 'DESC']
            ]
        }).then(Users => {
            if (!Users) {
                res.status(400).send({ error: err })
            } else {
                res.status(200).send({ Users })
            }

            // projects will be an array of all Project instances
        })
    } catch (err) {
        res.status(400).send({ error: err })
    }
}
exports.updateInformation = function(req, res) {
        try {
            if (req.body.id && req.body.id != "") {
                var reqData = req.body;
                var updateData = {};
                if (reqData.cname && reqData.cname != "") {
                    updateData.companyName = reqData.cname;
                }
                if (reqData.licenseStartDate && reqData.licenseStartDate != "") {
                    updateData.licenseStartDate = reqData.licenseStartDate;
                }
                if (reqData.licenseEndDate && reqData.licenseEndDate != "") {
                    updateData.licenseEndDate = reqData.licenseEndDate;
                }
                if (reqData.company_license && reqData.company_license != "") {
                    updateData.company_license = parseInt(reqData.company_license);
                }
                if (Object.keys(updateData).length > 0) {
                    Users.findOne({ where: { id: req.body.id } }).then(Users => {
                        if (Users) {
                            console.log(Users);
                            // Users.companyName = "klsjfljfs";
                            Users.update(updateData).then(() => {
                                res.status(200).send({ status: "success" })
                            })

                        } else {
                            res.status(400).send({ error: { message: "data not to update found" } })
                        }
                    }).catch(function(err) {
                        // print the error details
                        res.status(400).send({ error: err })
                    });
                } else {
                    res.status(400).send({ error: { message: "no data for update" } })
                }
            } else {
                res.status(400).send({ error: { message: "id requred" } })
            }
        } catch (err) {
            console.log("dskjfhkjdsh", err);
            res.status(400).send({ error: err })
        }
    }
    /***
     * @author Rupesh
     * @param {type} req
     * @param {type} res
     * @description it is responsible to Authenticate the user
     */
exports.postlogin = function(req, res) {
    if (req.body.email && req.body.email != "") {
        req.body.email = req.body.email.toLowerCase();
        Users.findOne({
            where: {
                'email': req.body.email
            }
        }).then(function(user) {

            if (!user) {
                res.status(400).send({ error: { message: 'Authentication failed. User not found.' } });
            } else {
                var fg = user.validPassword(req.body.password);
                console.log(fg);
                if (fg) {
                    var encript_Data = {
                        "expiresIn": Date.now() + (3600),
                        "Users": user
                    }; //expiration time of 1 hr
                    var token = jwt.encode(encript_Data, security_key.secret);
                    var data = {
                        token: 'Jloyds ' + token,
                        Users: user,
                        expiresIn: 3600,
                    };
                    if (user.role && user.role != 1) {
                        console.log('1', user.is_activated, user.company_license);
                        if (user.company_license != 1) {
                            res.status(400).send({ error: { message: 'Please Verify your company_license first.Your account is De-activated from admin' } });

                        } else {
                            if (user.is_activated != 1) {
                                res.status(400).send({ error: { message: 'Please Verify your account first.Your account is De-activated from admin' } });
                            } else {
                                console.log('2');
                                res.status(200).send({ data });
                            }

                        }
                    } else {
                        console.log('3');
                        if (user.is_activated != 1) {
                            res.status(400).send({ error: { message: 'Please Verify your account  first.Your account is De-activated from admin' } });

                        } else {
                            console.log('4');
                            res.status(200).send({ data });
                        }
                    }
                } else {
                    res.status(400).send({ error: { message: 'Authentication failed. Wrong password.' } });

                }
            }
        }).catch(function(err) {
            console.error(err.stack)
            return res.status(500).json({ message: "server issues when trying to login!" }); // server problems
        });
    } else {
        res.status(400).send({ error: { message: 'please provide us a valid email id' } });
    }
}