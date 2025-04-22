/* eslint-disable prettier/prettier */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable no-unused-vars */
const express = require('express')
const reviewController = require('./../controllers/review-controller');
const authController = require('./../controllers/authentication');


const router = express.Router({mergeParams: true});


router.use(authController.protect);
router.route('/')
.get(reviewController.getAllReviews)
.post(
    authController.restrictTo('user'),
    reviewController.setTourUserID,
    reviewController.createReview
);

router.route('/:id')
.get(reviewController.getReviewByID)
.delete(
    authController.restrictTo('user','admin'),
    reviewController.deleteReview
)
.patch(
    authController.restrictTo('user','admin'),
    reviewController.UpdateReview
);

module.exports = router;