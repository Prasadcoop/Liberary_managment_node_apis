const mysql = require('mysql2');


const db = mysql.createConnection({
    host: 'localhost',
    port: 3307,          
    user: 'root',         
    password: '',         
    database: 'liberary_management'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

module.exports = db;
