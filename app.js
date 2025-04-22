/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable node/no-missing-require */
/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-useless-path-segments */

const path = require('path')
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser')

const AppError = require('./utils/app-error');

const globalErrorHandler = require('./controllers/error-controller');

const userRouter = require('./routes/user-routes');  // Make sure this path is correct
const tourRouter = require('./routes/tour-routes');  // Import tour routes as well
const reviewRouter = require('./routes/review-routes');

const bookingRouter = require('./routes/booking-routes');

const viewRouter = require('./routes/view-routes');

const { Error } = require('mongoose');



const app = express();

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

// 1] GLOBAL Middleware
// Serving static files
app.use(express.static(path.join(__dirname,'public'))); 
// Set Security HTTP Headers

app.use(helmet());
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'", 'http:', 'blob:'],
//       scriptSrc: [
//         "'self'",
//         'https://cdn.jsdelivr.net',
//         'https://api.mapbox.com',
//         'https://js.stripe.com',
//         "'unsafe-inline'",
//         'blob:'
//       ],
//       styleSrc: [
//         "'self'",
//         'http:',
//         "'unsafe-inline'"
//       ],
//       connectSrc: [
//         "'self'",
//         'https://*.mapbox.com',
//         'https://events.mapbox.com'
//       ],
//       imgSrc: ["'self'", 'data:', 'https://api.mapbox.com'],
//       fontSrc: ["'self'", 'https:', 'data:'],
//       workerSrc: ["'self'", 'blob:'],
//       objectSrc: ["'none'"],
//       baseUri: ["'self'"]
//     }
//   })
// );



// Development Logging
if(process.env.node_env === "developement"){
    app.use(morgan('dev'));
}


// Limit request from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message:'Too many request from this IP, Please tyr agnain in an hours'
});
app.use('/api',limiter);

// Body parser, reading data from body innto req.body
app.use(express.json({limit:'10kb'}));
app.use(cookieParser());
app.use(express.urlencoded({extended:true,limit:'10kb'}));

// data sanitization against NOSQL query injection
app.use(mongoSanitize());


// Data sanitization against XSS
app.use(xss());

// prevent parameter polution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingdAverage',
        'maxGroup_Size',
        'difficulty',
        'price'
    ]
    
}));

// Serving Static files
// app.use(express.static(`${__dirname}/public`)); 

// app.use(express.static(path.join(__dirname,'public'))); 


// // Creating own middleware
app.use((req,res,next)=>{
    // console.log('Hello from the middleware🫡');
    next();
});

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    
    // console.log(req.cookies);

    next();
})

// app.get('/',(req,res)=>{
//     res.status(200)
//     .json({
//         message:'Hello from the server side..!!',
//         app:'Natours'
//     });
// });


// 3] Routes

app.use('/', viewRouter); // View Routes
app.use('/api/v1/users', userRouter);  // User routes
app.use('/api/v1/tours', tourRouter);  // Tour routes
app.use('/api/v1/reviews', reviewRouter);  // review router routes
app.use('/api/v1/bookings', bookingRouter); 


app.all('*',(req,res,next)=>{
// res.status(404).json({
//     status:'Fail',
//     message:`Can't find ${req.originalUrl} on this server...!`
// });

// const err = new Error(`Can't find ${req.originalUrl} on this server...!`);
// err.status = 'Fail';
// err.statusCode = 404;

    next(new AppError(`Can't find ${req.originalUrl} on this server...!`));

});


app.use(globalErrorHandler);

module.exports = app;
 
// Start the server
