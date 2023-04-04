class ErrorHandler extends Error {
    constructor(message,statuscode){
        super(message)
        this.statuscose = statuscode

        Error.captureStackTrace(this,this.constructor)
    }
}


module.exports = ErrorHandler