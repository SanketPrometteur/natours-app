/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-useless-path-segments */
const express = require('express');

const userController = require('../controllers/user-controller');
const authController = require('../controllers/authentication');
 



const router = express.Router();
 
// router.param('id', (req, res, next, val) => {
//   console.log(`Tour id is : ${val}`);
//   next();
// });

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// protect all routes after this middleware
router.use(authController.protect);

router.patch(
  '/updateMyPassword',
  authController.updatePassword
);
 

router.get(
  '/me',
  userController.getMe,
  userController.getUser
);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe 
);
router.delete(
  '/deleteMe',
  userController.deleteMe 
);
 
 
//  all the routes after this middleware are accessible by admin only
router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
 
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);



 
module.exports = router;