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
            if (err) console.log(err)
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


module.exports = router;