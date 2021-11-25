const pool=require('./config')


const router = require('.')

// 회원가입
router.get('/register',(req,res)=>{
    console.log('회원가입 페이지');
    res.render('register');
});

router.post('/register',(req,res,next)=>{
    const join=[req.body.name,req.body.registration_number,req.body.age,req.body.sex,req.body.phone_number]
    const login=[req.body.id,req.body.passwd,req.body.registration_number]
    const location=[req.body.province,req.body.city,req.body.district]

    if(req.body.passwd===req.body.checkpasswd) {
        pool.getConnection(function(err,connection){

            var sqlForSelectList = "SELECT * FROM login WHERE id=" +"'" + req.body.id + "'";
            console.log(sqlForSelectList);
            connection.query(sqlForSelectList,(err, row) => {
                if (err) console.log(err);
                if (!row.length) {
                    sqlForSelectList = "SELECT location_id FROM location WHERE " +
                        "province=" + "'" + req.body.province + "' AND " +
                        "city = " + "'" + req.body.city + "' AND " +
                        "district = " + "'" + req.body.district + "'";
                    console.log(sqlForSelectList);

                    connection.query(sqlForSelectList, (err1, row1) => {
                        if(err1) console.log(err1)

                        if(!row1.length){
                            const user=[req.body.name,req.body.registration_number,req.body.age,req.body.sex,req.body.phone_number];

                            connection.query('INSERT INTO location(`province`,`city`,`district`) VALUES (?,?,?)',location,(err2,row2)=>{
                                if(err2) console.log(err2);
                            });

                            connection.query('INSERT INTO user(`name`,`registration_number`,`age`,`sex`,`phone_number`, `fk_location_id`) VALUES (?,?,?,?,?,?)',user,(err2,row2)=>{
                                if(err2) console.log(err2)
                            })

                            connection.query('INSERT INTO login(`id`,`passwd`,`fk_registration_number`) VALUES (?,?,?)',login,(err2,row2)=>{
                                if(err2) console.log(err2);
                            });


                        }
                        else{
                            const user=[req.body.name,req.body.registration_number,req.body.age,req.body.sex,req.body.phone_number, row1[0].location_id];

                            connection.query('INSERT INTO user(`name`,`registration_number`,`age`,`sex`,`phone_number`, `fk_location_id`) VALUES (?,?,?,?,?,?)',user,(err2,row2)=>{
                                if(err2) console.log(err2)
                            })

                            connection.query('INSERT INTO login(`id`,`passwd`,`fk_registration_number`) VALUES (?,?,?)',login,(err2,row2)=>{
                                if(err2) console.log(err2);
                            });
                        }
                    })

                    res.redirect('/login')
                }
                else{
                    console.log('이미 존재하는 아이디입니다.');
                    res.render('register');

                }
            });



            connection.release();

        })
    }
    else
    {
        console.log('비밀번호 불일치');
    }


});

// 로그인
router.get('/login',(req,res)=>{
    res.render('login');
});

router.post('/login',(req,res)=> {
    const id = req.body.id;
    const passwd = req.body.passwd;


    pool.getConnection(function (err, connection) {

        var sqlForSelectList = "SELECT * FROM login WHERE id=" + "'" + req.body.id + "'";

        connection.query(sqlForSelectList,(err, row) => {
            if (err) console.log(err);
            if(!row.length){
                console.log('로그인 실패');
                console.log('아이디와 비밀번호를 확인하세요.');
                res.render('login');
            }
            else if (id == row[0].id && passwd == row[0].passwd) {
                console.log('로그인 성공');
                res.redirect('/');
            }
            else{
                console.log('로그인 실패');
                console.log('아이디와 비밀번호를 확인하세요.');
                res.render('login');
                //res.send('<script>alert("아이디와 비밀번호를 확인하세요.");</script>');
            }
            console.log(JSON.stringify(row));
        })

        connection.release();
    })

});

/*//나의 접종현황
router.get('/remaining_vaccine',(req,res)=>{
    res.render('remaining_vaccine');
});

router.post('/remaining_vaccine',(req,res)=> {

    const login=["asdasd","asdasd","191919-5555555"];

    pool.getConnection(function (err, connection) {

        var sqlForSelectList = "SELECT u.name, u.registration_number AS reg, v.vaccine_type, MAX(v.vaccination_number) AS n FROM login AS l JOIN user AS u ON " +
            "l.fk_registration_number = u.registration_number "+
            "JOIN vaccination AS v ON v.fk_registration_number = u.registration_number " +
            "WHERE l.id=" + "'" + login[0] + "'";


        console.log(sqlForSelectList);
        connection.query(sqlForSelectList,(err, row) => {
            if (err) console.log(err);
            if(!row.length){
                console.log(row[0].name + "님은 미접종자 입니다.");
                res.render('/');
            }
            else
            {
                console.log(row[0].name + "님은 " + row[0].n +"차 접종을 완료하셨습니다.");
                console.log(row[0]);
                if(row[0].n == 1)
                {   // 자동 예약 쿼리 4주 뒤
                    sqlForSelectList = "INSERT u.name, u.registration_number AS reg, v.vaccine_type, MAX(v.vaccination_number) AS n FROM login AS l JOIN user AS u ON " +
                        "l.fk_registration_number = u.registration_number "+
                        "JOIN vaccination AS v ON v.fk_registration_number = u.registration_number " +
                        "WHERE l.id=" + "'" + login[0] + "'";

                    connection.query(sqlForSelectList,(err1, row1) => {

                    });
                }
                res.redirect('/');

            }
        })
        connection.release();
    })


});*/

//잔여 백신 조회
router.get('/remaining_vaccine',(req,res)=>{
    res.render('remaining_vaccine');
});

router.post('/remaining_vaccine',(req,res)=> {
    const vaccine_type = req.body.vaccine_type;
    const province = req.body.province;
    /*const vaccine_type = "화이자";
    const province = "수도권";*/

    pool.getConnection(function (err, connection) {

        if(province == "수도권") {
            var sqlForSelectList = "SELECT * FROM vaccine JOIN hospital ON " +
                "fk_hospital_name = hospital_name JOIN location ON fk_location_id = location_id" +
                " WHERE vaccine_type=" + "'" + vaccine_type + "'" + "AND (province='서울시' OR province='경기도' OR province='인천시')";
        }
        else
        {
            var sqlForSelectList = "SELECT * FROM vaccine JOIN hospital ON " +
                "fk_hospital_name = hospital_name JOIN location ON fk_location_id = location_id" +
                " WHERE vaccine_type=" + "'" + vaccine_type + "'" + "AND province=" + "'" + province + "'";
        }
        console.log(sqlForSelectList);
        connection.query(sqlForSelectList,(err, row) => {
            if (err) console.log(err);
            if(!row.length){
                console.log('조건에 맞는 병원이 없습니다.');
                res.render('remaining_vaccine');
            }
            else
            {
                for(var i=0; i< row.length; i++)
                {
                    console.log(row[i]);
                }
                console.log('조회 성공');
                res.redirect('/');

            }
        })
        connection.release();
    })


});

module.exports = router;