/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-useless-path-segments */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tour-model');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
// const AppError = require('../utils/app-error');
const Booking = require('./../models/booking-model');


exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1] GET THE CURRENTLY BOOKED TOUR
  const tour = await Tour.findById(req.params.tourId);

  // 2] CREATE CHECKOUT SESSION
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',

    success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,

    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,

    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `https://natours.dev/img/tours/${tour.imageCover}`
            ]
          },
          unit_amount: tour.price * 100, // in cents
        },
        quantity: 1,
      }
    ],
  });

  // 3] SEND SESSION TO CLIENT
  res.status(200).json({
    status: 'success',
    session,
  });
});


exports.createBookingCheckout = catchAsync (async(req,res,next)=>{
    // this is only TEMPORARY, Because it's UNSECURE:everyone can make bookings without paying
    const {tour , user,  price} = req.query;
    if (!tour || !user || !price) return next();

    await Booking.create({
        tour: req.query.tour,
        user: req.query.user,
        price: Number(req.query.price)
    });


    res.redirect(req.originalUrl.split('?')[0]);

    next();
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);