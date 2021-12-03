const pool = require("./config");

const router = require(".");
const { NULL } = require("mysql/lib/protocol/constants/types");

const jwt = require("jsonwebtoken");

// 회원가입
router.get("/register", (req, res) => {
  console.log("회원가입 페이지");
  res.render("register");
});

router.post("/register", (req, res, next) => {
  console.log("회원가입 리퀘스트 데이터", req.body);

  // 지역정보 추출
  var beforeStr = req.body.residence;
  var afterStr = beforeStr.split(" ");

  if (afterStr[3] == undefined) {
    location_id = afterStr[0];
    province = afterStr[1];
    city = afterStr[2];
    district = null;
  } else {
    location_id = afterStr[0];
    province = afterStr[1];
    city = afterStr[2];
    district = afterStr[3];
  }

  // 나이 추출
  const now = new Date();
  const year = now.getFullYear();
  var month = now.getMonth() + 1;
  if (month < 10) month = "0" + month;
  var day = now.getDate();
  if (day < 10) day = "0" + day;
  const curDate = month.toString() + day;

  const regnum = req.body.registration_number;
  const birthday = regnum.substring(2, 6);
  var age =
    regnum.substring(7, 8) <= 2
      ? year - (1900 + parseInt(regnum.substring(0, 2)))
      : year - (2000 + parseInt(regnum.substring(0, 2)));
  if (curDate < birthday) age = age - 1;

  var user = [
    req.body.name,
    req.body.registration_number,
    age,
    req.body.sex,
    req.body.phone_number,
  ];
  const login = [req.body.id, req.body.password, req.body.registration_number];
  const location = [parseInt(location_id), province, city, district];
  console.log("유저정보", user);
  console.log("로그인정보", login);
  console.log("지역정보", location);

  pool.getConnection(function (err, connection) {
    var sqlForSelectList =
      "SELECT * FROM login WHERE id=" + "'" + req.body.id + "'";

    // 중복 id 확인
    connection.query(sqlForSelectList, (err, row) => {
      if (err) console.log(err);

      // 중복 아이디 없음
      if (!row.length) {
        sqlForSelectList =
          "SELECT location_id FROM location WHERE " +
          "province=" +
          "'" +
          province +
          "' AND " +
          "city = " +
          "'" +
          city +
          "' AND " +
          "district ";
        sqlForSelectList +=
          district === null ? "IS NULL" : "= " + district + "'";

        // 지역정보 있는지 확인
        connection.query(sqlForSelectList, (err1, row1) => {
          if (err1) console.log(err1);

          // 지역정보 없으면 삽입
          if (!row1.length) {
            connection.query(
              "INSERT INTO location(`location_id`,`province`,`city`,`district`) VALUES (?,?,?,?)",
              location,
              (err2, row2) => {
                if (err2) console.log(err2);
              }
            );

            // sqlForSelectList =
            //   "SELECT location_id FROM location WHERE " +
            //   "province=" +
            //   "'" +
            //   province +
            //   "' AND " +
            //   "city = " +
            //   "'" +
            //   city +
            //   "' AND " +
            //   "district = " +
            //   "'" +
            //   district +
            //   "'";

            // // 지역정보 id 받기
            // connection.query(sqlForSelectList, (err3, row3) => {
            //   if (err3) console.log(err3);
            //   const user = [
            //     req.body.name,
            //     req.body.registration_number,
            //     req.body.age,
            //     req.body.sex,
            //     req.body.phone_number,
            //     row3[0].location_id,
            //   ];

            // 유저정보 삽입
            user.push(parseInt(location_id));
            connection.query(
              "INSERT INTO user(`name`,`registration_number`,`age`,`sex`,`phone_number`, `fk_location_id`) VALUES (?,?,?,?,?,?)",
              user,
              (err4, row4) => {
                if (err4) console.log(err4);
              }
            );

            // 로그인정보 삽입
            connection.query(
              "INSERT INTO login(`id`,`passwd`,`fk_registration_number`) VALUES (?,?,?)",
              login,
              (err4, row4) => {
                if (err4) console.log(err4);
              }
            );
            //});
          } else {
            // 지역정보 이미 있으면

            // 유저정보 삽입
            user.push(parseInt(row1[0].location_id));
            connection.query(
              "INSERT INTO user(`name`,`registration_number`,`age`,`sex`,`phone_number`, `fk_location_id`) VALUES (?,?,?,?,?,?)",
              user,
              (err2, row2) => {
                if (err2) console.log(err2);
              }
            );
            console.log(login);
            // 로그인정보 삽입
            connection.query(
              "INSERT INTO login (`id`,`passwd`,`fk_registration_number`) VALUES (?,?,?)",
              login,
              (err2, row2) => {
                if (err2) console.log(err2);
              }
            );
          }

          // 토큰 생성
          const token = jwt.sign(
            {
              id: row[0].id,
              name: row[0].name, // 토큰의 내용(payload)
            },
            "temp", // 비밀 키
            {
              expiresIn: "7d", // 유효 기간 7일
            }
          );

          // 쿠키 설정
          res.cookie("access_token", token, {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
            httpOnly: true,
            SameSite: "secure",
          });

          res.json({ tkoen: token });
        });
      } else {
        console.log("이미 존재하는 아이디입니다.");
        res.status(409).json({
          error: "LOGIN FAILED",
          code: 9,
        });
      }
    });

    connection.release();
  });
});


// 로그인
router.get("/login", (req, res) => {

  if(req.user.id)
  {
    console.log("이미 로그인 되어있습니다.");
    res.render("index");
  }else
    res.render("login");
});

router.post("/login", (req, res) => {
  const id = req.body.id;
  const passwd = req.body.passwd;

  pool.getConnection(function (err, connection) {
    // login, user 조인해서 name 얻기
    var sqlForSelectList =
      "SELECT * FROM user, login WHERE id=" +
      "'" +
      req.body.id +
      "' AND fk_registration_number = registration_number";

    connection.query(sqlForSelectList, (err, row) => {
      if (err) console.log(err);

      if (!row.length) {
        console.log("로그인 실패");
        console.log("아이디와 비밀번호를 확인하세요.");
        res.status(401).json({
          error: "LOGIN FAILED",
          code: 1,
        });
      } else if (id == row[0].id && passwd == row[0].passwd) {
        console.log("로그인 성공");

        // 토큰 생성
        const token = jwt.sign(
          {
            id: row[0].id,
            name: row[0].name, // 토큰의 내용(payload)
          },
          "temp", // 비밀 키
          {
            expiresIn: "7d", // 유효 기간 7일
          }
        );

        // 쿠키 설정
        res.cookie("access_token", token, {
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
          httpOnly: true,
          SameSite: "secure",
        });

        res.json({ token: token });
      } else {
        console.log("로그인 실패");
        console.log("아이디와 비밀번호를 확인하세요.");
        res.status(401).json({
          error: "LOGIN FAILED",
          code: 1,
        });
      }
      //            console.log(JSON.stringify(row));
    });

    connection.release();
  });
});

/*
  로그인 체크
*/
router.get("/check", (req, res) => {
  const user = req.user;
  if (!user) {
    // 로그인 X
    res.status(401); // unauthorized
    return;
  }
  res.send(user);
});

//나의 접종현황
router.get("/info", (req, res) => {
  const id = req.user.id;

  pool.getConnection(function (err, connection) {
    var sqlForSelectList =
      "SELECT u.name, u.registration_number AS reg, v.vaccine_type, MAX(v.vaccination_number) AS n " +
      "FROM login AS l JOIN user AS u ON " +
      "l.fk_registration_number = u.registration_number " +
      "LEFT JOIN vaccination AS v ON v.fk_registration_number = u.registration_number " +
      "WHERE l.id=" +
      "'" +
      id +
      "'";

    // 사용자 접종정보
    connection.query(sqlForSelectList, (err, row) => {
      if (err) console.log(err);

      // 접종정보 없음
      if (row.n === NULL) {
        console.log(row[0].name + "님은 미접종자 입니다.");
        res.redirect("/");
      } else {
        // 접종접보 있음
        console.log(
          row[0].name + "님은 " + row[0].n + "차 접종을 완료하셨습니다."
        );
        sqlForSelectList =
          "SELECT reservation_date AS date, fk_hospital_name AS h_name, fk_registration_number AS reg, vaccine_type AS type " +
          "FROM user AS u " +
          "JOIN reservation AS r ON r.fk_registration_number = u.registration_number " +
          "WHERE u.registration_number=" +
          "'" +
          row[0].reg +
          "'";
        ("ORDER BY date");

        // 예약백신정보
        connection.query(sqlForSelectList, (err1, row1) => {
          // 날짜 주소 백신타입 출력
          console.log(row1[0].date, row1[0].h_name, row1[0].type);

          console.log(row[0], row1[0]);

          const info = {
            vaccination_number: row[0].n,
            reservation: {
              vaccine_type: row1[0].type,
              hospital_name: row1[0].h_name,
              date: row1[0].date,
            },
          };
          res.send(info);
        });
      }
    });
    connection.release();
  });
});

router.post("/info", (req, res) => {
  const id = req.user.id;

  pool.getConnection(function (err, connection) {
    var sqlForSelectList =
      "SELECT u.name, u.registration_number AS reg, v.vaccine_type, MAX(v.vaccination_number) AS n " +
      "FROM login AS l JOIN user AS u ON " +
      "l.fk_registration_number = u.registration_number " +
      "LEFT JOIN vaccination AS v ON v.fk_registration_number = u.registration_number " +
      "WHERE l.id=" +
      "'" +
      id +
      "'";

    // 사용자 접종정보
    connection.query(sqlForSelectList, (err, row) => {
      if (err) console.log(err);

      // 접종정보 없음
      if (row.n != NULL) {
        console.log(row[0].name + "님은 미접종자 입니다.");
        res.redirect("/");
      } else {
        // 접종접보 있음

        // 1차만
        if (row[0].n == 1) {
          console.log(
            row[0].name + "님은 " + row[0].n + "차 접종을 완료하셨습니다."
          );
          sqlForSelectList =
            "SELECT reservation_date AS date, fk_hospital_name AS h_name, fk_registration_number AS reg, vaccine_type AS type " +
            "FROM user AS u " +
            "JOIN reservation AS r ON r.fk_registration_number = u.registration_number " +
            "WHERE u.name=" +
            "'" +
            row[0].name +
            "'";
          ("ORDER BY date");

          // 예약백신정보
          connection.query(sqlForSelectList, (err1, row1) => {
            // 날짜 주소 백신타입 출력
            console.log(row1[0].date, row1[0].h_name, row1[0].type);

            console.log(row[0], row1);
            //res.send(user);
          });
        } else if (row[0].n == 2) {
          // 접종완료
          console.log(
            row[0].name + "님은 " + row[0].n + "차 접종을 완료하셨습니다."
          );

          console.log(row[0]);
        }
        res.redirect("/");
      }
    });
    connection.release();
  });
});

//잔여 백신 조회
router.get("/remaining_vaccine", (req, res) => {
  res.render("remaining_vaccine");
});

router.post("/remaining_vaccine", (req, res) => {
  const vaccine_type = req.body.vaccine_type;
  const province = req.body.province;

  pool.getConnection(function (err, connection) {
    if (province == "수도권") {
      var sqlForSelectList =
        "SELECT * FROM vaccine JOIN hospital ON " +
        "fk_hospital_name = hospital_name JOIN location ON fk_location_id = location_id" +
        " WHERE vaccine_type=" +
        "'" +
        vaccine_type +
        "'" +
        "AND (province='서울시' OR province='경기도' OR province='인천시')";
    } else {
      var sqlForSelectList =
        "SELECT * FROM vaccine JOIN hospital ON " +
        "fk_hospital_name = hospital_name JOIN location ON fk_location_id = location_id" +
        " WHERE vaccine_type=" +
        "'" +
        vaccine_type +
        "'" +
        "AND province=" +
        "'" +
        province +
        "'";
    }

    console.log(sqlForSelectList);
    connection.query(sqlForSelectList, (err, row) => {
      if (err) console.log(err);
      if (!row.length) {
        console.log("조건에 맞는 병원이 없습니다.");
        res.render("remaining_vaccine");
      } else {
        for (var i = 0; i < row.length; i++) {
          console.log(row[i]);
        }
        console.log("조회 성공");
        res.redirect("/");
      }
    });
    connection.release();
  });
});

/*예약가능 의료기관 조회*/
router.get("/reservationlist", (req, res, next) => {
  res.render("reservationlist");
});

router.post("/reservationlist", (req, res, next) => {
  pool.getConnection(function (err, connection) {
    var beforeStr = req.body.residence;
    var afterStr = beforeStr.split(" ");

    if (afterStr[2] == undefined) {
      province = afterStr[0];
      city = afterStr[1];
      district = null;
    } else {
      province = afterStr[0];
      city = afterStr[1];
      district = afterStr[2];
    }
    const remain = [
      req.body.vaccine_type,
      province,
      city,
      district,
      req.body.time,
    ];

    var selectquery =
      "SELECT h.hospital_name, l.province, l.city, l.district ,v.vaccine_type, v.quantity, h.opening_time, h.closing_time " +
      "FROM hospital h,vaccine v,location l " +
      "WHERE hospital_name=fk_hospital_name AND fk_location=location_id AND vaccine_type=? AND province=? AND city=? AND district=? AND (? BETWEEN opening_time AND closing_time) AND quantity>0";

    connection.query(selectquery, remain, (err, row) => {
      if (err) console.log(err);
      if (!row.length) {
        console.log("조건에 맞는 병원이 없습니다.");
        res.render("reservationlist");
      } else {
        for (var i = 0; i < row.length; i++) {
          console.log(row[i]);
        }
        console.log("조회 성공");
        res.redirect("/");
      }
    });
  });
});

/*예약*/
router.post("/reservation", (req, res, next) => {
  pool.getConnection(function (err, connection) {
    // 유저 id 에서 주민번호 받기
    connection.query(
      "SELECT fk_registration_number AS reg FROM login WHERE id = " +
        req.user.id,
      (err, row) => {
        if (err) console.log(err);

        // (default)대기, 취소, 완료
        const reserv = [
          req.body.hospital_name,
          row[0].reg,
          req.body.date,
          req.body.vaccine_type,
          "대기",
        ];
      }
    );

    connection.query(
      "INSERT INTO reservation(`fk_hospital_name`,`fk_registration_number`,`reservation_date`,`vaccine_type`,`state`) VALUES (?,?,?,?,?)",
      reserv,
      (err) => {
        if (err) console.log(err);
      }
    );
  });
});

// 접종 결과 조회
router.post("/vaccine_result", (req, res) => {
  // 날짜별, 백신별, 지역별
  const option = req.body.option;
  var sqlForSelectList = "";
  pool.getConnection(function (err, connection) {
    // timestamp 형식 수정필요
    if (option == "날짜별") {
      // 1차 접종
      sqlForSelectList =
        "SELECT * FROM reservation r, vaccination v, user u" +
        "WHERE r.state = '완료' AND " +
        "r.fk_registration_number = u.registration_number AND v.fk_registration_number = u.registration_number " +
        "AND v.vaccination = 1 " +
        "ORDER BY r.reservation_date";
      connection.query(sqlForSelectList, (err, row1) => {
        if (err) console.log(err);
        console.log(row1);
      });
      // 2차 접종
      sqlForSelectList =
        "SELECT * FROM reservation r, vaccination v, user u" +
        "WHERE r.state = '완료' AND " +
        "r.fk_registration_number = u.registration_number AND v.fk_registration_number = u.registration_number " +
        "AND v.vaccination = 2 " +
        "ORDER BY r.reservation_date";
      connection.query(sqlForSelectList, (err, row2) => {
        if (err) console.log(err);
        console.log(row2);
      });
    } else if (option == "백신별") {
      // 1차접종
      sqlForSelectList =
        "SELECT vaccine_type,COUNT(fk_registration_number) FROM vaccination " +
        "WHERE vaccination_number = 1 " +
        "GROUP BY vaccine_type";

      connection.query(sqlForSelectList, (err, row3) => {
        if (err) console.log(err);
        console.log(row3);
      });

      // 2차접종
      sqlForSelectList =
        "SELECT vaccine_type, COUNT(fk_registration_number) FROM vaccination " +
        "WHERE vaccination_number = 2 " +
        "GROUP BY vaccine_type";
      connection.query(sqlForSelectList, (err, row4) => {
        if (err) console.log(err);
        console.log(row4);
      });
    } else if (option == "지역별") {
      // 1차 접종
      sqlForSelectList =
        "SELECT l.province, COUNT(DISTINCT fk_registration_number) FROM location l, reservation r, user u" +
        "WHERE l.location_id = u.fk_location_id " +
        "AND u.registration_id = l.fk_registration_id " +
        "AND r.state = '완료'" +
        "GROUP BY l.province";
      connection.query(sqlForSelectList, (err, row5) => {
        if (err) console.log(err);
        console.log(row5);
      });
      // 2차 접종
      sqlForSelectList =
        "SELECT l.province, COUNT(fk_registration_number) FROM location l, reservation r, user u" +
        "WHERE l.location_id = u.fk_location_id " +
        "AND u.registration_id = l.fk_registration_id " +
        "AND r.state = '완료' " +
        "GROUP BY l.province " +
        "HAVING COUNT(fk_registration_number) > 1";
      connection.query(sqlForSelectList, (err, row6) => {
        if (err) console.log(err);
        console.log(row6);
      });
    }
    connection.release();
  });
});
module.exports = router;
