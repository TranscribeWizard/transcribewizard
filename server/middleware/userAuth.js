const jwt = require('jsonwebtoken')

const verify = (req,res,next) =>{
    if(req.headers.token){
        try {
            const token = req.headers.token.split(' ')[1]
             jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{
                 if(!err){
                    req.user = user
                    next()
                 }
                 else{
            res.status(403).json({msg:'token not valid'})
                 }
            })
           
        } catch (error) {
            res.status(400).json({error})
        }
    }
    else{
        res.status(401).json({msg:'you are not authenticated'})
    }
}

module.exports = verify