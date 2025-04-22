/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable constructor-super */
class AppError extends Error{
    constructor(message,statusCode){
        super(message);


        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this,this.constructor);
    }


}

module.exports = AppError;