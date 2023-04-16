const ErrorHandler = require('../utils/ErrorHandler')


module.exports = (err,req,res,next) =>{
    err.statusCode = err.statusCode || 500,
    err.message = err.message || "Internal Server Error"

    if(err.name == 'CastError'){
       const message = `Resourse Not Found. Invalid ${err.path}`
       err = new ErrorHandler(message,400)
    }
    console.log({
        success:false,
        statusCode:err.statusCode,
        message:err.message,
        Stack:err.stack
    })
    
    res.status(err.statusCode).json({
        success:false,
        statusCode:err.statusCode,
        message:err.message,
        // Stack:err.stack
    })
}