const pool = require("./config");
const mysql = require("mysql");
const router = require(".");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

// 서버 시작 시 실행
// location 데이터, hospital 데이터, vaccine 데이터 로드
pool.getConnection(function (err, connection) {
  if (err) console.log(err);
  else {
    console.log("Data loading...");
    /* csv 파일 로컬 경로 */
    const hospitalFilePath =
      path.parse(__dirname).dir + "\\public\\csv\\hospital_data.csv";
    const locationFilePath =
      path.parse(__dirname).dir + "\\public\\csv\\location_data.csv";
    const vaccineFilePath =
      path.parse(__dirname).dir + "\\public\\csv\\vaccine_data.csv";

    /* hospital 테이블, vaccine 테이블 create table문에서 병원명 길이 변경해주시면 아래 코드 지워주세요
      여기서 부터 */
    var sql = "SET foreign_key_checks = 0";
    connection.query(sql, (err) => {
      if (err) console.log(err);
    });
    sql =
      "ALTER TABLE hospital MODIFY COLUMN hospital_name varchar(25) NOT NULL";
    connection.query(sql, (err) => {
      if (err) console.log(err);
      else {
        console.log("success");
      }
    });
    sql =
      "ALTER TABLE vaccine MODIFY COLUMN fk_hospital_name varchar(25) NOT NULL";
    connection.query(sql, (err) => {
      if (err) console.log(err);
      else {
        console.log("success");
      }
    });
    sql =
      "ALTER TABLE reservation MODIFY COLUMN fk_hospital_name varchar(25) NOT NULL";
    connection.query(sql, (err) => {
      if (err) console.log(err);
      else {
        console.log("success");
      }
    });
    sql = "DROP trigger insert_vaccination_trigger";
    connection.query(sql, (err) => {
      if (err) console.log("trigger does not exist");
      else {
        console.log("success");
      }
    });
    sql = "TRUNCATE location";
    connection.query(sql, (err) => {
      if (err) console.log(err);
    });
    sql = "SET foreign_key_checks = 1";
    connection.query(sql, (err) => {
      if (err) console.log(err);
    });
    // 트리거 수정
    sql =
      "create trigger insert_vaccination_trigger " +
      "before update on reservation for each row " +
      "begin if new.state='완료' and old.state!='완료' and " +
      "not exists(select vaccination_number from vaccination v where new.fk_registration_number=v.fk_registration_number) " +
      "then insert into vaccination(fk_registration_number, vaccination_number, vaccine_type) " +
      "values(new.fk_registration_number, 1, new.vaccine_type); " +
      "else UPDATE vaccination SET vaccination_number = 2 where fk_registration_number = new.fk_registration_number; " +
      "end if; end;";
    connection.query(sql, (err) => {
      if (err) console.log(err);
    });
    /* 여기까지 */

    // MySQL 경로 질의
    sql = `SHOW VARIABLES LIKE "secure_file_priv"`;
    connection.query(sql, (err, row) => {
      if (err) console.log(err);
      else {
        var MySQLPath = row[0].Value;
        var location = MySQLPath + "\\location_data.csv";
        var hospital = MySQLPath + "\\hospital_data.csv";
        var vaccine = MySQLPath + "\\vaccine_data.csv";
        // MySQL 경로로 데이터 파일 복사
        fs.copyFileSync(locationFilePath, location);
        fs.copyFileSync(hospitalFilePath, hospital);
        fs.copyFileSync(vaccineFilePath, vaccine);

        // MySQL 경로의 \를 /로 변경
        MySQLPath = MySQLPath.replace(/\\/g, "/");
        // location 데이터 로드
        sql =
          `LOAD DATA INFILE ? ` +
          "INTO TABLE location " +
          "FIELDS TERMINATED BY ',' " +
          `OPTIONALLY ENCLOSED BY '' ` +
          `LINES TERMINATED BY '\\r\\n' ` +
          "IGNORE 1 ROWS " +
          "(location_id,province,city,@district) " +
          "SET district = IF(@district='', NULL, @district)";
        sql = mysql.format(sql, [MySQLPath + "/location_data.csv"]);
        connection.query(sql, (err, row) => {
          if (err) console.log("Failed to load location data. ");
          else {
            console.log("success");
          }
        });
        // hospital 데이터 로드
        sql =
          `LOAD DATA INFILE ? ` +
          "INTO TABLE hospital " +
          "FIELDS TERMINATED BY ',' " +
          `ENCLOSED BY '"' ` +
          `LINES TERMINATED BY '\\r\\n' ` +
          "IGNORE 1 ROWS";
        sql = mysql.format(sql, [MySQLPath + "/hospital_data.csv"]);
        connection.query(sql, (err, row) => {
          if (err) console.log("Failed to load hospital data.");
          else {
            console.log("success");
          }
        });
        // vaccine 데이터 로드
        sql =
          `LOAD DATA INFILE ? ` +
          "INTO TABLE vaccine " +
          "FIELDS TERMINATED BY ',' " +
          `ENCLOSED BY '"' ` +
          `LINES TERMINATED BY '\\r\\n' ` +
          "IGNORE 1 ROWS";
        sql = mysql.format(sql, [MySQLPath + "/vaccine_data.csv"]);
        connection.query(sql, (err, row) => {
          if (err) console.log("Failed to load vaccine data. ");
          else {
            console.log("success");
          }
        });
      }
    });
  }
  connection.release();
});

router.post("/auth/register", (req, res) => {
  // 지역정보 추출
  var beforeStr = req.body.residence;
  var afterStr = beforeStr.split(" ");

  var location_id = afterStr[0];
  var province = afterStr[1];
  var city = afterStr[2];
  var district;
  if (afterStr[3] == undefined) {
    district = null;
  } else {
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
    parseInt(location_id),
  ];
  const login = [req.body.id, req.body.password, req.body.registration_number];
  const location = [parseInt(location_id), province, city, district];

  pool.getConnection(function (err, connection) {
    if (err) console.log(err);
    else {
      var sql = "SELECT * FROM login WHERE id=?";

      // 중복 id 확인
      connection.query(sql, [req.body.id], (err, row) => {
        if (err) console.log(err);
        else {
          // 중복 아이디 없음
          if (!row.length) {
            connection.query(
              "SELECT * FROM location WHERE location_id=?",
              [parseInt(location_id)],
              (err, row) => {
                if (err) console.log(err);
                else {
                  // 지역정보 없음
                  if (!row.length) {
                    connection.query(
                      "INSERT INTO location(`location_id`,`province`,`city`,`district`) VALUES (?,?,?,?)",
                      location,
                      (err, row) => {
                        if (err) console.log(err);
                      },
                    );
                  }
                }
              },
            );
            connection.query(
              "SELECT * FROM user WHERE registration_number = ? OR phone_number = ?",
              [regnum, req.body.phone_number],
              (err, row) => {
                if (err) console.log(err);
                else {
                  // 중복 정보 없음
                  if (!row.length) {
                    connection.query(
                      "INSERT INTO user(`name`,`registration_number`,`age`,`sex`,`phone_number`, `fk_location_id`) VALUES (?,?,?,?,?,?)",
                      user,
                      (err, row) => {
                        if (err) console.log(err);
                        else {
                          connection.query(
                            "INSERT INTO login(`id`,`passwd`,`fk_registration_number`) VALUES (?,?,?)",
                            login,
                            (err, row) => {
                              if (err) console.log(err);
                              else {
                                // 토큰 생성
                                const token = jwt.sign(
                                  {
                                    id: req.body.id,
                                    name: req.body.name, // 토큰의 내용(payload)
                                  },
                                  "temp", // 비밀 키
                                  {
                                    expiresIn: "7d", // 유효 기간 7일
                                  },
                                );

                                // 쿠키 설정
                                res.cookie("access_token", token, {
                                  maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
                                  httpOnly: true,
                                  SameSite: "secure",
                                });

                                res.json({ token: token });
                              }
                            },
                          );
                        }
                      },
                    );
                  } else {
                    res.status(409).json({
                      error: "이미 존재하는 주민번호 또는 전화번호입니다.",
                      code: 9,
                    });
                  }
                }
              },
            );
          } else {
            res.status(409).json({
              error: "이미 존재하는 아이디입니다.",
              code: 9,
            });
          }
        }
      });
      connection.release();
    }
  });
});

router.post("/auth/login", (req, res) => {
  const id = req.body.id;
  const passwd = req.body.password;

  pool.getConnection(function (err, connection) {
    // login, user 조인해서 name 얻기
    var sqlForSelectList =
      "SELECT * FROM user, login WHERE user.registration_number = login.fk_registration_number AND id=?";

    connection.query(sqlForSelectList, [id], (err, row) => {
      if (err) console.log(err);

      if (!row.length) {
        res.status(401).json({
          error: "LOGIN FAILED",
          code: 1,
        });
      } else if (id == row[0].id && passwd == row[0].passwd) {
        // 토큰 생성
        const token = jwt.sign(
          {
            id: row[0].id,
            name: row[0].name, // 토큰의 내용(payload)
          },
          "temp", // 비밀 키
          {
            expiresIn: "7d", // 유효 기간 7일
          },
        );

        // 쿠키 설정
        res.cookie("access_token", token, {
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
          httpOnly: true,
          SameSite: "secure",
        });

        res.json({ token: token });
      } else {
        res.status(401).json({
          error: "LOGIN FAILED",
          code: 1,
        });
      }
    });

    connection.release();
  });
});

/*
  로그인 체크
*/
router.get("/auth/check", (req, res) => {
  const user = req.user;
  if (!user) {
    // 로그인 X
    res.status(401); // unauthorized
    return;
  }
  res.send(user);
});

/**
 * 로그아웃
 */
router.post("/auth/logout", (req, res) => {
  res.cookie("access_token", "").json({ logoutSuccess: true });
});

//나의 접종현황
router.get("/info", (req, res) => {
  const id = req.user.id;

  pool.getConnection(function (err, connection) {
    if (err) console.log(err);
    else {
      var sqlForSelectList =
        "SELECT u.name, u.registration_number AS reg, MAX(v.vaccination_number) AS n " +
        "FROM login AS l JOIN user AS u ON l.fk_registration_number = u.registration_number " +
        "LEFT JOIN vaccination AS v ON v.fk_registration_number = u.registration_number " +
        "WHERE l.id=?";

      // 사용자 접종정보
      connection.query(sqlForSelectList, [id], (err, row) => {
        if (err) console.log(err);
        const { n = null } = row[0];
        // 접종정보 없음
        if (row.n === null) {
        } else {
          // 접종접보 있음
          sqlForSelectList =
            "SELECT reservation_date AS date, r.fk_hospital_name AS h_name, r.vaccine_type AS type " +
            "FROM login AS l, user AS u  " +
            "JOIN reservation AS r ON r.fk_registration_number = u.registration_number " +
            "WHERE l.id=? AND u.registration_number=l.fk_registration_number AND r.state = '대기'" +
            "ORDER BY date";

          // 예약백신정보
          connection.query(sqlForSelectList, [id], (err1, row1) => {
            var info;
            if (!row1.length) {
              // 예약정보 X
              info = { vaccination_number: n };
            } else {
              // 예약정보 존재
              const { date, h_name, type } = row1[0];
              info = {
                vaccination_number: n,
                reservation: {
                  vaccine_type: type,
                  hospital_name: h_name,
                  date: date,
                },
              };
            }
            res.send(info);
          });
        }
      });
      connection.release();
    }
  });
});
/* 자동 2차 접종 예약 */
/* 최근 예약 기록한 병원에서 같은 백신으로 예약 */
router.post("/done_vaccine", (req, res) => {
  var info;

  pool.getConnection(function (err, connection) {
    // 유저 id 에서 주민번호 받아서 접종 기록 가져오기
    connection.query(
      "SELECT r.reservation_id AS id, l.fk_registration_number AS reg, r.reservation_date AS date, " +
        "r.fk_hospital_name AS hospital_name, r.vaccine_type AS type " +
        "FROM login l, reservation r  " +
        "WHERE l.id = ? " +
        "AND r.fk_registration_number = l.fk_registration_number " +
        "AND r.state = '대기' " +
        "ORDER BY r.reservation_id DESC",
      [req.user.id],
      (err, row) => {
        if (err) console.log(err);
        else {
          // 기존의 예약상태를 완료로 변경
          connection.query(
            "UPDATE reservation " +
              "SET state = '완료' " +
              "WHERE reservation_id = ?",
            [row[0].id],
            (err) => {
              if (err) console.log(err);
              else {
                // 1차 접종인 경우, 2차 자동 예약
                if (req.body.vaccination_number === 1) {
                  // 모더나는 4주 뒤, 나머지는 3주 뒤 예약
                  var reserv_date = row[0].date;
                  if (row[0].type == "모더나")
                    reserv_date.setDate(reserv_date.getDate() + 28);
                  else reserv_date.setDate(reserv_date.getDate() + 21);
                  // 새로운 예약 정보
                  // (default)대기, 완료
                  const reserv = [
                    row[0].hospital_name,
                    row[0].reg,
                    reserv_date,
                    row[0].type,
                    "대기",
                  ];

                  connection.query(
                    "INSERT INTO reservation(`fk_hospital_name`,`fk_registration_number`,`reservation_date`,`vaccine_type`,`state`) VALUES (?,?,?,?,?)",
                    reserv,
                    (err) => {
                      if (err) console.log(err);
                    },
                  );
                  // 백신 개수 감소
                  // 백신이 없는 경우 20개 추가 후 1개 감소
                  connection.query(
                    "UPDATE vaccine " +
                      "SET quantity = " +
                      "CASE " +
                      "WHEN quantity> 0 THEN quantity - 1 " +
                      "ELSE quantity + 20 - 1 " +
                      "END " +
                      "WHERE fk_hospital_name = ? AND vaccine_type = ?",
                    [row[0].hospital_name, row[0].type],
                    (err) => {
                      if (err) console.log(err);
                    },
                  );
                  info = {
                    vaccination_number: req.body.vaccination_number,
                    reservation: {
                      vaccine_type: row[0].type,
                      hospital_name: row[0].hospital_name,
                      date: reserv_date,
                    },
                  };
                  console.log(info);
                  res.send(info);
                  // 2차 접종인 경우
                } else {
                  info = { vaccination_number: req.body.vaccination_number };
                  console.log(info);
                  res.send(info);
                }
              }
            },
          );
        }
      },
    );
    connection.release();
  });
});

/**
 * 잔여 백신 조회
 */
router.get("/remaining_vaccine", (req, res) => {
  const vaccine_type = req.query.vaccine_type;
  const residence = req.query.residence;

  // 글자 포함 문자열
  const hospital_name = "%" + req.query.hospital_name + "%";

  pool.getConnection(function (err, connection) {
    var sqlForSelectList =
      "SELECT * FROM vaccine JOIN hospital ON " +
      "fk_hospital_name = hospital_name JOIN location ON fk_location_id = location_id";

    // 병원 이름이 없는 경우
    if (hospital_name === "%undefined%") {
      // 지역,백신 선택안함
      if (!residence && !vaccine_type) {
      }
      // 지역 선택안함
      else if (!residence) {
        sqlForSelectList += " WHERE ?? = ?";
        sqlForSelectList = mysql.format(sqlForSelectList, [
          "vaccine_type",
          vaccine_type,
        ]);
      }
      // 백신 선택안함
      else if (!vaccine_type) {
        sqlForSelectList += " WHERE ?? = ?";
        sqlForSelectList = mysql.format(sqlForSelectList, [
          "location_id",
          residence,
        ]);
      }
      // 지역,백신 선택
      else {
        sqlForSelectList += " WHERE ?? = ? AND ?? = ?";
        sqlForSelectList = mysql.format(sqlForSelectList, [
          "vaccine_type",
          vaccine_type,
          "location_id",
          residence,
        ]);
      }
    }
    // 병원 이름 있는 경우
    else {
      sqlForSelectList += " WHERE ?? = ? AND ?? = ? AND ?? LIKE ?";
      sqlForSelectList = mysql.format(sqlForSelectList, [
        "vaccine_type",
        vaccine_type,
        "location_id",
        residence,
        "hospital_name",
        hospital_name,
      ]);
    }

    // else if (province == "수도권") {
    //   var sqlForSelectList =
    //     "SELECT * FROM vaccine JOIN hospital ON " +
    //     "fk_hospital_name = hospital_name JOIN location ON fk_location_id = location_id" +
    //     " WHERE vaccine_type=" +
    //     "'" +
    //     vaccine_type +
    //     "'" +
    //     "AND (province='서울시' OR province='경기도' OR province='인천시')";
    // }

    connection.query(sqlForSelectList, (err, row) => {
      if (err) console.log(err);
      if (!row.length) {
      } else {
        // for (var i = 0; i < row.length; i++) {
        //   console.log(row[i]);
        // }
      }
      res.send(row);
    });

    connection.release();
  });
});

/*예약*/
router.post("/api/reservation", (req, res, next) => {
  pool.getConnection(function (err, connection) {
    // 유저 id 에서 주민번호 받기
    connection.query(
      "SELECT fk_registration_number AS reg FROM login WHERE id = ?",
      [req.user.id],
      (err, row) => {
        if (err) console.log(err);

        // (default)대기, 완료
        const date = new Date(req.body.date);
        date.setHours(
          date.getHours() + parseInt(req.body.time.substring(0, 2)),
        );
        const reserv = [
          req.body.hospital_name,
          row[0].reg,
          date,
          req.body.vaccine_type,
          "대기",
        ];

        // 기존 예약 있으면 취소
        connection.query(
          "SELECT reservation_id, fk_hospital_name, vaccine_type " +
            "FROM reservation r ,login l " +
            "WHERE id = ? " +
            "AND l.fk_registration_number = r.fk_registration_number " +
            "AND r.state = '대기'",
          [req.user.id],
          (err, row) => {
            if (err) console.log(err);
            // 기존 예약 있는 경우
            if (row.length) {
              connection.query(
                "UPDATE vaccine " +
                  "SET quantity = quantity + 1 " +
                  "WHERE fk_hospital_name = ? AND vaccine_type = ?",
                [row[0].fk_hospital_name, row[0].vaccine_type],
                (err) => {
                  if (err) console.log(err);
                },
              );
              connection.query(
                "delete from reservation where reservation_id = ?",
                [row[0].reservation_id],
                (err) => {
                  if (err) console.log(err);
                },
              );
            }
          },
        );

        // 예약
        connection.query(
          "INSERT INTO reservation(`fk_hospital_name`,`fk_registration_number`,`reservation_date`,`vaccine_type`,`state`) VALUES (?,?,?,?,?)",
          reserv,
          (err) => {
            if (err) console.log(err);
            else {
              // 백신 개수 감소
              // 백신이 없는 경우 20개 추가 후 1개 감소
              connection.query(
                "UPDATE vaccine " +
                  "SET quantity = " +
                  "CASE " +
                  "WHEN quantity> 0 THEN quantity - 1 " +
                  "ELSE quantity + 20 - 1 " +
                  "END " +
                  "WHERE fk_hospital_name = ? AND vaccine_type = ?",
                [req.body.hospital_name, req.body.vaccine_type],
                (err) => {
                  if (err) console.log(err);
                  else {
                    res.json({
                      success: "success",
                    });
                  }
                },
              );
            }
          },
        );
      },
    );
    connection.release();
  });
});

router.post("/cancel", (req, res) => {
  var info;
  pool.getConnection(function (err, connection) {
    connection.query(
      "SELECT reservation_id, fk_hospital_name, vaccine_type " +
        "FROM reservation r ,login l " +
        "WHERE id = ? " +
        "AND l.fk_registration_number = r.fk_registration_number " +
        "AND r.state = '대기'",
      [req.user.id],
      (err, row) => {
        if (err) console.log(err);
        else {
          // 기존 예약 있는 경우
          if (row.length) {
            connection.query(
              "UPDATE vaccine " +
                "SET quantity = quantity + 1 " +
                "WHERE fk_hospital_name = ? AND vaccine_type = ?",
              [row[0].fk_hospital_name, row[0].vaccine_type],
              (err) => {
                if (err) console.log(err);
              },
            );
            connection.query(
              "delete from reservation where reservation_id = ?",
              [row[0].reservation_id],
              (err) => {
                if (err) console.log(err);
              },
            );
            info = { vaccination_number: req.body.vaccination_number - 1 };
            console.log(info);
            res.send(info);
          }
        }
      },
    );
    connection.release();
  });
});

// 접종 결과 조회
router.get("/vaccine_result", (req, res) => {
  // option0 : Bar / Line / Pie
  // option1 : time / residence
  // option2 : number / type / age / gender
  // option3 : 누적 t/f
  const { option0, option1, option2, option3 } = req.query;
  console.log(req.query);
  var sqlForSelectList = "";

  pool.getConnection(function (err, connection) {
    /*
      원형 그래프
      옵션 2만 사용 (1, 3 disable)
      데이터의 기준을 id
      접종자수를 value
      
      예시
      {
        id: '서울',
        value: 13
      }
    */
    if (option0 === "Pie") {
      if (option2 === "number") {
        // 미접종자와 1차 접종자 와 완료자 수
        sqlForSelectList =
          "SELECT CASE " +
          "WHEN vaccination_number = 1 THEN '1차' " +
          "WHEN vaccination_number = 2 THEN '2차' " +
          "ELSE '미접종' " +
          "END " +
          "AS id, COUNT(*) AS value " +
          "FROM user LEFT JOIN vaccination ON registration_number = fk_registration_number  " +
          "AND (vaccination_number IS NULL OR vaccination_number <3) " +
          "GROUP BY id";
      } else if (option2 === "type") {
        // 백신별 접종 완료자수
        sqlForSelectList =
          "SELECT vaccine_type AS id, COUNT(*)AS value " +
          "FROM vaccination " +
          "WHERE vaccination_number='2' " +
          "GROUP BY vaccine_type";
      } else if (option2 === "age") {
        // 연령별 접종 완료자수
        sqlForSelectList =
          "SELECT CASE " +
          "WHEN age < 20 THEN '10대' " +
          "WHEN age < 30 THEN '20대' " +
          "WHEN age < 40 THEN '30대' " +
          "WHEN age < 50 THEN '40대' " +
          "WHEN age < 60 THEN '50대' " +
          "WHEN age < 70 THEN '60대' " +
          "ELSE '70세 이상' " +
          "END AS id ,COUNT(*) AS value " +
          "FROM user u, vaccination v " +
          "WHERE u.registration_number = v.fk_registration_number AND v.vaccination_number=2 " +
          "GROUP BY id " +
          "ORDER BY id";
      } else if (option2 === "gender") {
        // 성별 접종 완료자수
        sqlForSelectList =
          "SELECT CASE " +
          "WHEN sex = 'M' THEN '남성' " +
          "ELSE '여성' " +
          "END AS id, COUNT(*) AS value " +
          "FROM user, vaccination " +
          "WHERE registration_number = fk_registration_number AND vaccination_number=2 " +
          "GROUP BY id";
      }

      /*sqlForSelectList =
        "SELECT l.province AS id,COUNT(v.fk_registration_number) AS value " +
        "FROM user u JOIN location l ON l.location_id = u.fk_location_id " +
        "LEFT OUTER JOIN vaccination v ON v.fk_registration_number = u.registration_number AND v.vaccination_number = 2 " +
        "GROUP BY l.province";*/
    }
    /*
      막대 그래프
      가로축 option1
      세로축 접종자수
      하나의 막대를 option2로 구분
      
      property 정확해야됨

      예시
      {
        time: '7월',
        1치 접종: 10,
        2차 접종: 21,
      }
    */
    if (option0 === "Bar") {
      if (option1 === "time") {
        if (option2 === "type") {
        }
        if (option2 === "age") {
        }
        if (option2 === "gender") {
        }
        if (option2 === "number") {
        }
        // 날짜별 접종 완료자 수
        sqlForSelectList =
          "SELECT DATE_FORMAT(r.reservation_date, '%m-%d') AS time, " +
          "COUNT(CASE WHEN vaccination_number = 1 THEN 1 END) AS 1차, " +
          "COUNT(CASE WHEN vaccination_number = 2 THEN 1 END) AS 2차 " +
          "FROM reservation r, vaccination v, user u " +
          "WHERE r.state = '완료' " +
          "AND r.fk_registration_number = u.registration_number " +
          "AND v.fk_registration_number = u.registration_number " +
          "AND v.vaccination_number >= 1 " +
          "GROUP BY time " +
          "ORDER BY time";
      }
      if (option1 === "residence") {
        if (option2 === "type") {
        }
        if (option2 === "age") {
        }
        if (option2 === "gender") {
        }
        if (option2 === "number") {
        }

        // 지역별 접종 완료자 수
        sqlForSelectList =
          "SELECT l.province AS residence," +
          "COUNT(CASE WHEN vaccination_number = 1 THEN 1 END) AS 1차, " +
          "COUNT(CASE WHEN vaccination_number = 2 THEN 1 END) AS 2차 " +
          "FROM location l, vaccination v, user u " +
          "WHERE v.fk_registration_number = u.registration_number " +
          "AND u.fk_location_id = l.location_id " +
          "AND v.vaccination_number >= 1 " +
          "GROUP BY residence ";
      }
    }
    /*
      선 그래프
      
      각 id당 한줄씩 그려짐
      id가 option2
      data x가 option1
      data y가 접종자수

      예시
      {
        id: '남자',
        data: [
          {
            x: '경기도',
            y: 63,
          },
          {
            x: '강원도',
            y: 32,
          },
          ...
        ],
      },
    */
    if (option0 === "Line") {
      if (option1 === "time") {
        if (option2 === "type") {
        }
        if (option2 === "age") {
        }
        if (option2 === "gender") {
          // sqlForSelectList =
          //   "SELECT l.province AS id,COUNT(v.fk_registration_number) AS value " +
          //   "FROM user u JOIN location l ON l.location_id = u.fk_location_id " +
          //   "LEFT OUTER JOIN vaccination v ON v.fk_registration_number = u.registration_number AND v.vaccination_number = 2 " +
          //   "GROUP BY l.province";
        }
        if (option2 === "number") {
        }

        // 날짜별 1차 접종자 수
        sqlForSelectList =
          "SELECT DATE_FORMAT(r.reservation_date, '%m-%d') AS x, COUNT(*) AS y " +
          "FROM reservation r, vaccination v, user u " +
          "WHERE r.state = '완료' " +
          "AND r.fk_registration_number = u.registration_number " +
          "AND v.fk_registration_number = u.registration_number " +
          "AND v.vaccination_number >= 2 " +
          "GROUP BY x " +
          "ORDER BY x ";
      }
      if (option1 === "residence") {
        if (option2 === "type") {
        }
        if (option2 === "age") {
        }
        if (option2 === "gender") {
          // sqlForSelectList =
          //   "SELECT u.sex AS id,l.province AS x,COUNT(v.fk_registration_number) AS y " +
          //   "FROM location l LEFT OUTER JOIN user u ON l.location_id = u.fk_location_id " +
          //   "LEFT OUTER JOIN vaccination v ON v.fk_registration_number = u.registration_number " +
          //   "GROUP BY l.province, u.sex ";
        }
        if (option2 === "number") {
        }

        // 지역별 접종 완료자 수
        sqlForSelectList =
          "SELECT l.province AS x, COUNT(*) AS y " +
          "FROM location l, vaccination v, user u " +
          "WHERE v.fk_registration_number = u.registration_number " +
          "AND u.fk_location_id = l.location_id " +
          "AND v.vaccination_number >= 2 " +
          "GROUP BY x";
      }
    }
    console.log("결과 조회 쿼리", sqlForSelectList);

    connection.query(sqlForSelectList, (err, row1) => {
      if (err) console.log(err);
      res.send(row1);
    });

    connection.release();
  });
  /*pool.getConnection(function (err, connection) {
    if (option1 === "time") {
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
    }
    connection.release();
  });*/
});

module.exports = router;
