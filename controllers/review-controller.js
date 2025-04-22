/* eslint-disable prettier/prettier */
/* eslint-disable import/no-useless-path-segments */
const Review = require('./../models/review-model');
// const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');


// get all Reviews
// exports.getAllReviews = catchAsync(async(req,res,next)=>{
//     let filter={};
//     if(req.params.tourID )filter = {tour : req.params.tourID}

//     const reviews = await Review.find(filter);


//     res.status(200).json({
//         status: 'Success',
//         results: reviews.length,
//         data:{
//             reviews
//         }
//     })
// });

exports.getAllReviews = factory.getAll(Review);


// Create new Review
// exports.createReview = catchAsync(async(req,res,next)=>{
//     // Allow Nested routes
//     if(!req.body.tour) req.body.tour = req.params.tourID;
//     if(!req.body.user) req.body.user = req.user.id;

//     const newReview = await Review.create(req.body);
//     res.status(201).json({
//             status:'success',
//             data:{
//                 tour:newReview
//             }
//         });
// });
exports.setTourUserID =(req,res,next)=>{
        // Allow Nested routes
    if(!req.body.tour) req.body.tour = req.params.tourID;
    if(!req.body.user) req.body.user = req.user.id;
    next();
}

exports.getReviewByID = factory.getOne(Review);

exports.createReview = factory.createOne(Review);

// Update Review
exports.UpdateReview = factory.updateOne(Review);

// Delete Review
exports.deleteReview = factory.deleteOne(Review);
