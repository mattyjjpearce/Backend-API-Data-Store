let mysql = require('mysql');

//Ensuring the connection to AWS RDS 
var connection = mysql.createConnection({
    host: "gforces.cv5s4hqjdy2c.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "gforcespassword",
    database: "main",
});

//connecting the database, and initializing a table if one has not been created in sql workbench already 
connection.connect(function(err) {
    if (err) throw err;
    connection.query('CREATE DATABASE IF NOT EXISTS main;');
    connection.query('USE main;');
    connection.query('CREATE TABLE IF NOT EXISTS cars(id varchat(128) NOT NULL, manufacturer varchar(100), model varchar(100), price int, PRIMARY KEY(id));', function(error, result, fields) {
        console.log("connected");
    });
});

//exportin the module, to be used in index.js 
module.exports = connection;


  