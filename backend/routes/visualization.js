var express =require('express');
var router = express.Router();
var mysql = require("mysql");

var pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "vaccine",
    password: "1234",
    dateStrings: "date",
});

router.get("/", (req, res) => {

    var sqlForSelectList = "";
    pool.getConnection(function (err, connection) {
        // 연령대별 접종자수
        /*sqlForSelectList = "SELECT CASE " +
            "WHEN age < 20 THEN '10대' " +
            "WHEN age < 30 THEN '20대' " +
            "WHEN age < 40 THEN '30대' " +
            "WHEN age < 50 THEN '40대' " +
            "WHEN age < 60 THEN '50대' " +
            "WHEN age < 70 THEN '60대' " +
            "ELSE '70세 이상' " +
            "END AS age_group ,COUNT(*) AS cnt " +
            "FROM user u, vaccination v " +
            "WHERE u.registration_number = v.fk_registration_number AND v.vaccination_number=2 " +
            "GROUP BY age_group " +
            "ORDER BY age_group";*/
        /*// 1차 접종 맞은 사람들
        sqlForSelectList =
            "SELECT l.province ,COUNT(v.fk_registration_number) AS cnt " +
            "FROM user u JOIN location l ON l.location_id = u.fk_location_id " +
            "LEFT OUTER JOIN vaccination v ON v.fk_registration_number = u.registration_number " +
            "AND v.vaccination_number = 2 " +
            "GROUP BY l.province";*/
        // 접종 완료자
        sqlForSelectList =
            "SELECT l.province ,COUNT(v.fk_registration_number) AS cnt " +
            "FROM user u JOIN location l ON l.location_id = u.fk_location_id " +
            "LEFT OUTER JOIN vaccination v ON v.fk_registration_number = u.registration_number " +
            "AND v.vaccination_number = 2 " +
            "GROUP BY l.province";

        connection.query(sqlForSelectList, (err, row1) => {
            if (err) console.log(err);
            console.log(row1);
            res.render('visualization', {title: 'visualization', rows: row1});
        });

       /* if (option1 === "time") {
            // 1차 접종
            sqlForSelectList =
                "SELECT r.reservation_date, COUNT(DISTINCT v.fk_registration_number) " +
                "FROM reservation r, vaccination v, user u " +
                "WHERE r.state = '완료' AND " +
                "r.fk_registration_number = u.registration_number AND v.fk_registration_number = u.registration_number " +
                "AND v.vaccination_number = 1 " +
                "GROUP BY r.reservation_date " +
                "ORDER BY r.reservation_date";
            connection.query(sqlForSelectList, (err, row1) => {
                if (err) console.log(err);
                var d = new Date(row1[0].reservation_date);
                // 년 월 일
                console.log(d.getFullYear(), d.getMonth() + 1, d.getDate());
            });
            // 2차 접종
            sqlForSelectList =
                "SELECT r.reservation_date,COUNT(DISTINCT v.fk_registration_number) " +
                "FROM reservation r, vaccination v, user u " +
                "WHERE r.state = '완료' AND " +
                "r.fk_registration_number = u.registration_number AND v.fk_registration_number = u.registration_number " +
                "AND v.vaccination_number = 2 " +
                "GROUP BY r.reservation_date " +
                "ORDER BY r.reservation_date";
            connection.query(sqlForSelectList, (err, row2) => {
                if (err) console.log(err);
            });
        } else if (option == "백신별") {
            // 1차접종
            sqlForSelectList =
                "SELECT vaccine_type,COUNT(DISTINCT fk_registration_number) " +
                "FROM vaccination " +
                "WHERE vaccination_number = 1 " +
                "GROUP BY vaccine_type";

            connection.query(sqlForSelectList, (err, row3) => {
                if (err) console.log(err);
                console.log(row3);
            });

            // 2차접종
            sqlForSelectList =
                "SELECT vaccine_type, COUNT(DISTINCT fk_registration_number) " +
                "FROM vaccination " +
                "WHERE vaccination_number = 2 " +
                "GROUP BY vaccine_type";
            connection.query(sqlForSelectList, (err, row4) => {
                if (err) console.log(err);
                console.log(row4);
            });
        } else if (option == "지역별") {
            // 1차 접종
            sqlForSelectList =
                "SELECT l.province, COUNT(DISTINCT v.fk_registration_number) " +
                "FROM location l, reservation r, user u, vaccination v " +
                "WHERE l.location_id = u.fk_location_id AND v.fk_registration_number = u.registration_number " +
                "AND u.registration_number = r.fk_registration_number " +
                "AND r.state = '완료' " +
                "AND v.vaccination_number = 1 " +
                "GROUP BY l.province";
            connection.query(sqlForSelectList, (err, row5) => {
                if (err) console.log(err);
                console.log(row5);
            });
            // 2차 접종
            sqlForSelectList =
                "SELECT l.province, COUNT(DISTINCT v.fk_registration_number) " +
                "FROM location l, reservation r, user u, vaccination v " +
                "WHERE l.location_id = u.fk_location_id AND v.fk_registration_number = u.registration_number " +
                "AND u.registration_number = r.fk_registration_number " +
                "AND r.state = '완료' " +
                "AND v.vaccination_number = 2 " +
                "GROUP BY l.province";

            connection.query(sqlForSelectList, (err, row6) => {
                if (err) console.log(err);
                console.log(row6);
            });
        }*/
        connection.release();
    });
});

router.post("/", (req, res) => {
    res.redirect("/visual");
});
module.exports = router;