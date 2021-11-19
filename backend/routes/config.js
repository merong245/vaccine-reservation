var mysql=require('mysql')

var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    database: 'vaccine',
    password: '1234'
});

module.exports=pool;