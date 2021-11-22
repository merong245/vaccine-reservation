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


            connection.query('INSERT INTO user(`name`,`registration_number`,`age`,`sex`,`phone_number`) VALUES (?,?,?,?,?)',join,(err,row)=>{
                if(err) console.log(err)
            })

            connection.query('INSERT INTO login(`id`,`passwd`,`fk_registration_number`) VALUES (?,?,?)',login,(err,row)=>{
                if(err) console.log(err)
            })

            connection.query('INSERT INTO location(`province`,`city`,`district`) VALUES (?,?,?)',location,(err,row)=>{
                if(err) console.log(err)
            })

            res.redirect('/login')
            res.send('<script>alert("회원가입 완료");</script>')
            connection.release();
            
        })
    }
    else
    {
        console.log('비밀번호 불일치');
    }
    
    
    res.end()
})

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