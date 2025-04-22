/* eslint-disable prettier/prettier */
/* eslint-disable import/no-useless-path-segments */
const express = require('express');

const router = express.Router();
const tourController = require('../controllers/tour-controller');

const authController = require('./../controllers/authentication');

// const reviewController = require('./../controllers/review-controller');

const reviewRouter = require('./review-routes')


// router.param('id',tourController.checkID)


// POST/tour/:id?/Review
// GET/tour/:id?/Review
// GET/tour/?:id/Review/?:id

// router.route('/:tourID/reviews')
// .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
// );

router.use('/:tourID/reviews',reviewRouter);


router.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(
    authController.protect,
    authController.restrictTo('admin','lead-guide','guide'),
    tourController.getMonthlyPlan
);

router.route('/tours-within/:distance/center/:latlng/unit/:unit')
.get(tourController.getTourWithin)
// tours-distance?distance=233&center=-40,45&unit-mi
//tours-distance/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit')
.get(tourController.getDistance);


router
.route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(
        authController.protect,
        authController.restrictTo('admin','lead-guide'),
        tourController.createNewTour
    ) //tourController.checkBody

router
.route('/:id')
    .get(tourController.getTourByID)
    .patch(authController.protect,
        authController.restrictTo('admin','lead-guid'),
        tourController.uploadTourImages,
        tourController.resizeTourImages,
        tourController.updateTourData
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin','lead-guid'),
        tourController.deleteTourData
    )




module.exports = router;