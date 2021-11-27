const pool=require('./config')


const router = require('.')
const {NULL} = require("mysql/lib/protocol/constants/types");

// 회원가입
router.get('/register',(req,res)=>{
    console.log('회원가입 페이지');
    res.render('register');
});

router.post('/register',(req,res,next)=>{
    var beforeStr=req.body.residence;
    var afterStr=beforeStr.split(' ');

    if(afterStr[2]==undefined)
    {
        province=afterStr[0];
        city=afterStr[1];
        district=null

    }
    else{
        province=afterStr[0];
        city=afterStr[1];
        district=afterStr[2];


    }

    const join=[req.body.name,req.body.registration_number,req.body.age,req.body.sex,req.body.phone_number]
    const login=[req.body.id,req.body.passwd,req.body.registration_number]
    const location=[province,city,district]

    if(req.body.passwd===req.body.checkpasswd) {
        pool.getConnection(function(err,connection){

            var sqlForSelectList = "SELECT * FROM login WHERE id=" +"'" + req.body.id + "'";
            connection.query(sqlForSelectList,(err, row) => {
                if (err) console.log(err);
                if (!row.length) {
                    sqlForSelectList = "SELECT location_id FROM location WHERE " +
                        "province=" + "'" + province + "' AND " +
                        "city = " + "'" + city + "' AND " +
                        "district = " + "'" + district + "'";

                    connection.query(sqlForSelectList, (err1, row1) => {
                        if(err1) console.log(err1)

                        if(!row1.length){

                            connection.query('INSERT INTO location(`province`,`city`,`district`) VALUES (?,?,?)',location,(err2,row2)=>{
                                if(err2) console.log(err2);
                            });
                            sqlForSelectList = "SELECT location_id FROM location WHERE " +
                                "province=" + "'" + province + "' AND " +
                                "city = " + "'" + city + "' AND " +
                                "district = " + "'" + district + "'";

                            connection.query(sqlForSelectList, (err3, row3) => {
                                if(err3) console.log(err3);
                                const user=[req.body.name,req.body.registration_number,req.body.age,req.body.sex,req.body.phone_number, row3[0].location_id];

                                connection.query('INSERT INTO user(`name`,`registration_number`,`age`,`sex`,`phone_number`, `fk_location_id`) VALUES (?,?,?,?,?,?)',user,(err4,row4)=>{
                                    if(err4) console.log(err4)
                                });

                                connection.query('INSERT INTO login(`id`,`passwd`,`fk_registration_number`) VALUES (?,?,?)',login,(err4,row4)=>{
                                    if(err4) console.log(err4);
                                });

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
            }
            console.log(JSON.stringify(row));
        })

        connection.release();
    })

});

//나의 접종현황
router.get('/my_vaccine',(req,res)=>{
    res.render('my_vaccine');
});
router.post('/my_vaccine',(req,res)=> {

    // 세션 로그인 아이디로 추후 수정
    const id = "zxczxc";

    pool.getConnection(function (err, connection) {

        var sqlForSelectList = "SELECT u.name, u.registration_number AS reg, v.vaccine_type, MAX(v.vaccination_number) AS n " +
            "FROM login AS l JOIN user AS u ON " +
            "l.fk_registration_number = u.registration_number "+
            "LEFT JOIN vaccination AS v ON v.fk_registration_number = u.registration_number " +
            "WHERE l.id=" + "'" + id + "'";


        connection.query(sqlForSelectList,(err, row) => {
            if (err) console.log(err);
            if(row.n != NULL){
                console.log(row[0].name + "님은 미접종자 입니다.");
                res.redirect('/');
            }
            else
            {
                if(row[0].n == 1)
                {

                    console.log(row[0].name + "님은 " + row[0].n +"차 접종을 완료하셨습니다.");
                    sqlForSelectList = "SELECT reservation_date AS date, fk_hospital_name AS h_name, fk_registration_number AS reg, vaccine_type AS type " +
                        "FROM user AS u " +
                        "JOIN reservation AS r ON r.fk_registration_number = u.registration_number " +
                        "WHERE u.name=" + "'" + row[0].name + "'"
                        "ORDER BY date";

                    connection.query(sqlForSelectList,(err1, row1) => {
                        // 날짜 주소 백신타입 출력
                        console.log(row1[0].date, row1[0].h_name,row1[0].type);

                    });
                }
                else if(row[0].n == 2){
                    console.log(row[0].name + "님은 " + row[0].n +"차 접종을 완료하셨습니다.");
                }
                res.redirect('/');

            }
        })
        connection.release();
    })


});

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

/*예약가능 의료기관 조회*/
router.get('/reservationlist',(req,res,next)=>{
    res.render('reservationlist');
});

router.post('/reservationlist',(req,res,next)=>{
    pool.getConnection(function(err,connection){
        var beforeStr=req.body.residence;
        var afterStr=beforeStr.split(' ');

        if(afterStr[2]==undefined)
        {
            province=afterStr[0];
            city=afterStr[1];
            district=null

        }
        else{
            province=afterStr[0];
            city=afterStr[1];
            district=afterStr[2];

        }
        const remain=[req.body.vaccine_type,province,city,district,req.body.time]

        var selectquery="SELECT h.hospital_name, l.province, l.city, l.district ,v.vaccine_type, v.quantity, h.opening_time, h.closing_time "+
            "FROM hospital h,vaccine v,location l "+
            "WHERE hospital_name=fk_hospital_name AND fk_location=location_id AND vaccine_type=? AND province=? AND city=? AND district=? AND (? BETWEEN opening_time AND closing_time) AND quantity>0"


        connection.query(selectquery,remain,(err,row)=>{
            if (err) console.log(err);
            if(!row.length){
                console.log('조건에 맞는 병원이 없습니다.');
                res.render('reservationlist');
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

    })

})

/*예약*/
router.post('/reservation',(req,res,next)=>{
    pool.getConnection(function(err,connection){
        const reserv=[req.body.hospital_name,req.body.registration_number,req.body.date,req.body.vaccine_type,"완료"]
        connection.query('INSERT INTO reservation(`fk_hospital_name`,`fk_registration_number`,`reservation_date`,`vaccine_type`,`state`) VALUES (?,?,?,?,?)',reserv,(err,row)=>{
            if(err) console.log(err)
        })
    })
})


module.exports = router;