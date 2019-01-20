var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var bodyParser = require('body-parser');
global.dotenv = require('dotenv');
dotenv.config();


var app = express();
global.constants = require('./Config/constants');
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }));

global.db = require('./Config/database.js');
global.middleware = require('./Middlewares/CommonMiddlewares');
//force: true will drop the table
// if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//     console.log('Drop and Resync with { force: true }');
// });
app.use(function(err, req, res, next) {
    // error handling logic
    res.send({
        status: false,
        message: "Something went wrong : " + err,
        data: {}
    });
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var apiRoutes = express.Router();
require('./routes/routes')(apiRoutes);
app.use('/api', apiRoutes);
module.exports = app;