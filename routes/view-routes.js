/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
/* eslint-disable import/no-useless-path-segments */
const express = require('express');
const viewsController = require('./../controllers/views-controller');
const authController = require('./../controllers/authentication');
const bookingController = require('./../controllers/bookingController');

const router = express.Router();
// //Testing purpose route
// router.get('/',(req,res)=>{
    //     res.status(200).render('base',{
//         title: 'The Forest Hiker',
//         user:'Sanket'
//     })
// });



router.get(
    '/',
    bookingController.createBookingCheckout,
    authController.isLoggedIn,
    viewsController.getOverview
);

router.get(
    '/tour/:slug',
    authController.isLoggedIn,
    viewsController.getTour
);

router.get(
    '/login',
    authController.isLoggedIn,
    viewsController.getLoginForm
);

router.get(
    '/signup',
    viewsController.getSignupForm
);

router.get(
    '/me',
    authController.protect,
    viewsController.getAccount
);

router.get(
    '/my-tours',
    authController.protect,
    viewsController.getMyTours
);

router.post(
    '/submit-user-data',
    authController.protect,
    viewsController.updateUserData
)

module.exports = router;