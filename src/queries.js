const db = require('./db.js');

module.exports = {
    getUserByUsernameAndPassword: (username, password, callback) => {
        db.query('SELECT * FROM usertable WHERE username = ? AND password = ?', [username, password], callback);
    },
    checkUsername: (username, callback) => {
        db.query('SELECT * FROM usertable WHERE username = ?', [username], callback);
    },
    createUser: (username, password, phone, callback) => {
        db.query('INSERT INTO usertable (username, password, phone) VALUES (?, ?, ?)', [username, password, phone], callback);
    }
};
