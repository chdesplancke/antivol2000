var mysql = require('mysql2');
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DB,
    multipleStatements : true
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;