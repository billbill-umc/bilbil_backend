var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'bilbil',
    password: 'bilbil',
    database: 'bilbil'
});
db.connect();

module.exports = db;