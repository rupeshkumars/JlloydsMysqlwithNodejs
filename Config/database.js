const Sequelize = require('sequelize');
const sequelize = new Sequelize(constants.development.dbName, constants.development.dbUserName, constants.development.dbPwd, {
    host: constants.development.dnHost,
    dialect: constants.development.dialect,
    logging: function() {},
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    dialectOptions: {
        socketPath: constants.development.socketPath
    },
    define: {
        paranoid: true
    }
});
// sequelize
//     .authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//         res.status(500).send({ error: err })
//     });
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('../models/users.js')(sequelize, Sequelize);

module.exports = db;