const env = process.env.NODE_ENV || 'development';
const session = require('express-session');
const mysql = require('mysql')
const MySQLStore = require('express-mysql-session')(session);
// Use the default DB setting, no need to write again 
const dbConfig = require(__dirname + '/database')[env];

// Got this part from express-mysql-session npm How to Use
const options = {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database
};

const sessionStore = new MySQLStore(options);
// let pool = mysql.createPool(options)
// console.log('pool', pool)

module.exports = session({
    key: 'event-manager-session',
    secret: 'ddd7f4e13132d90594812ccd66c9e4cc04937c7e',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
});