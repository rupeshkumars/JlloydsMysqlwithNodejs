/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// config/database.js
const moment = require('moment');
let m = moment();
module.exports = {
    development: {
        dbName: process.env.DB_NAME,
        dbUserName: process.env.DB_USERNAME,
        dnHost: process.env.DB_HOSTNAME,
        dbPwd: process.env.DB_PASSWORD,
        dialect: process.env.DIALECT,
        socketPath: process.env.SocketPath
    }
};