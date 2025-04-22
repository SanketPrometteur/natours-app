/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-undef */
/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable no-unused-vars */
const express = require('express');
const User = require('./../models/user-module');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/app-error');
// const APIFeatures = require('./../utils/apifeatures');
const factory = require('./handlerFactory');

const multer = require('multer');
const sharp = require('sharp');


// DISK STORAGE
// const multerStorage = multer.diskStorage({
//   destination:(req,file,callBackFuntion)=>{
//     callBackFuntion(null,'public/img/users');
//   },
//   filename:(req,file,callBackFuntion)=>{
//     const ext = file.mimetype.split('/')[1];
//     callBackFuntion(null,`user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });


// MEMORY STORAGE
const multerStorage = multer.memoryStorage();


const multerFilter = (req,file,callBackFuntion)=>{
  if(file.mimetype.startsWith('image')){
    callBackFuntion(null,true);
  }else{
    callBackFuntion(new AppError('Not an image!!..Please upload only Images',400),false);
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');


exports.resizeUserPhoto = catchAsync (async (req,res,next) =>{
  if(!req.file)return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
  .resize(500,500)
  .toFormat('jpeg')
  .jpeg({quality:90})
  .toFile(`public/img/users/${req.file.filename}`);

  next();

});
 
const filterObj  = (obj, ...alllowedFields) =>{
   const newObj ={};
    Object.keys(obj).forEach(el =>{
        if(alllowedFields.includes(el)) newObj[el] = obj[el];
    });
 
    return newObj;
};

exports.getMe = (req,res,next)=>{
  req.params.id = req.user.id;
  next();
}
 

// get all users
// exports.getAllUsers = catchAsync (async (req,res, next)=>{
//   const users = await User.find();
 
//   // Send respone
//     res.status(200).json({
//       status: 'success',
//       result: users.length,
//       data: {
//         users,
//       },
//     });
// });

exports.getAllUsers = factory.getAll(User);
 
 
// While we are creating new user at the time of signup so we are not use create user functionality here
exports.createUser = (req,res)=>{
  res.status(500).json({
      status:'error',
      message:'This route is not yet defined!...Please use /signup instead.'
  });
};
 
 
 
exports.getUser = factory.getOne(User);
 

//Do Not update password with this..!!!
exports.updateUser = factory.updateOne(User);
 
exports.deleteUser = factory.deleteOne(User);
 
 
exports.updateMe = catchAsync(async(req,res,next)=>{

  // console.log(req.file);
  // console.log(req.body);

  //1)create error if user posts password data
  if(req.body.password || req.body.passwordConfirm){
      return next(new AppError('This route is not for password update, plase use / UpdateMyPassword.', 400));
  }

//2)Filtered out unwanted field names that are not allowed to updated
  const  filteredBody = filterObj(req.body, 'name', 'email');

  if(req.file) filteredBody.photo = req.file.filename;

  //3)Update the user doucument
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true,runValidators:true });
 
 
  res.status(200).json({
    status:'success',
    data:{
      user:updatedUser
    }
  });
 
});
 
exports.deleteMe = catchAsync( async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user.id,{active:false});
 
  res.status(204).json({
    status:'success',
    data:null
  });
});