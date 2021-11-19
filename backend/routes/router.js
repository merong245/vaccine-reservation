const pool=require('./config')


const router = require('.')


router.post('/register',(req,res,next)=>{
    const join=[req.body.name,req.body.registration_number,req.body.age,req.body.sex,req.body.phone_number]
    const login=[req.body.id,req.body.passwd,req.body.registration_number]
    const location=[req.body.province,req.body.city,req.body.district]
    if(req.body.passwd===req.body.checkpasswd)
    {
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
                
            
        })
    }
    else
        console.log('비밀번호 불일치');
    
    
    res.end()
})

module.exports = router;