/* eslint-disable prettier/prettier */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable no-unused-vars */
const express = require('express')
const reviewController = require('../controllers/review-controller');
const authController = require('../controllers/authentication');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.use(authController.protect)
router.get(
    '/checkout-session/:tourId',
    bookingController.getCheckoutSession
);

router.use(authController.restrictTo('admin','lead-guide'));

router.route('/')
    .post(bookingController.createBooking)
    .get(bookingController.getAllBooking);

router.route('/:id')
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking);

module.exports = router;