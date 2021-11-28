var mysql = require("mysql");

var pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  database: "vaccine",
  password: "1234",
});

module.exports = pool;

// 커넥션 확인
pool.getConnection(function (err, connection) {
  if (!err) {
    console.log("connected!");
  }
  connection.release();
});
