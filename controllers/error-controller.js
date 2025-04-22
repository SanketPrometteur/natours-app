/* eslint-disable prettier/prettier */
/* eslint-disable no-lonely-if */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable node/no-missing-require */

const AppError = require("./../utils/app-error");

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    // console.log(value);
    const message = `Duplicate field value : ${value}. Please use another value`;
    return new AppError(message, 400);
}

// const handleValidationErrorDB = err =>{
//     const errors = Object.values(err.errors).map(el => el.message);

//     const message = `Invalid Input Data. ${errors.join('. ')}`;
//     return new AppError(message,400);
// }


const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};


const handleJWTError = () => new AppError('Invalid Token Please login again', 401);


const handleJWTExpiredError = () => new AppError('Your Token has expired..!! Please login again...', 401);



const sendErrorDev = (err, req, res) => {
    // A] API
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }

    // B] RENDER WEBSITE
        console.error('ERROR...💥',err);
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong..!',
            msg: err.message
        })
    
}


const sendErrorProd = (err, req, res) => {
    // A] API
    if (req.originalUrl.startsWith('/api')) {
        // A] Operational error, Trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        } 
            // B] Programming or unknown error: don't leak error details to client.
            // 1] log error
            console.log('Error...!!💥💥', err)

            // 2] Send generic message
            return res.status(500).json({
                status: 'Error',
                message: 'Something went very wrong...!💥',
            });
        
    } 
        //  B] RENDER WEBSITE
        // A] error, Trusted error: send message to client
        if (err.isOperational) {
           return res.status(err.statusCode).render('error', {
                title: 'Something went wrong..!',
                msg: err.message
            });
        } 

            // B] Programming or unknown error: don't leak error details to client.
            // 1] log error
            console.log('Error...!!💥💥', err)

            // 2] Send generic message
            return res.status(err.statusCode).render('error', {
                title: 'Something went wrong..!',
                msg: 'Please try again later...!'
            });
}


module.exports = (err, req, res, next) => {

    // console.log(err.stack)

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);

    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;
        error.name = err.name;
        error.code = err.code;
        error.errmsg = err.errmsg;


        if (error.name === 'CastError') error = handleCastErrorDB(error);

        if (error.code === 11000) error = handleDuplicateFieldsDB(error);

        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

        if (error.name === 'JsonWebTokenError') error = handleJWTError();

        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, req, res);
    }
}
