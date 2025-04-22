/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
/* eslint-disable arrow-body-style */
/* eslint-disable no-undef */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable no-lone-blocks */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
// const fs = require('fs');
const AppError = require('../utils/app-error');
const Tour = require('./../models/tour-model');

// const APIFeatures = require('./../utils/api-features');

const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const multer = require('multer');
const sharp = require('sharp');


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

exports.uploadTourImages = upload.fields([
    {name: 'imageCover',maxCount:1},
    {name :'images',maxCount:3}
]);

// upload.single('image')
// upload.array('images',5);

exports.resizeTourImages = catchAsync(async(req,res,next)=>{
    // console.log(req.files);

    if(!req.files.imageCover || !req.files.images) return next();

    //  1] COVER IMAGE
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
    .resize(2000,1333)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`public/img/tours/${req.body.imageCover}`);

    // 2] Images
    req.body.images = [];
    await Promise.all(req.files.images.map(async(file,index) => {
        const fileName = `tour-${req.params.id}-${Date.now()}-${index+1}.jpeg`;

        await sharp(file.buffer)
        .resize(2000,1333)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`public/img/tours/${fileName}`);

        req.body.images.push(fileName);
    }));

    // console.log(req.body);
    next();
});


exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}


//get all tours
// exports.getAllTours = catchAsync(async(req,res,next)=>{

//             //   console.log(req.query);

//         // 5]EXECUTE QUERY
//         const features = new APIFeatures(Tour.find(),req.query).filter().sort().limitFields().paginate();

//         const tours = await features.query;


//         // 6] SEND RESOPNSE
//         res.status(200).json({
//             status:'success',
//             result:tours.length,
//             data:{
//                 tours
//             }
//         });
// });

exports.getAllTours = factory.getAll(Tour);

//get tour by id

// exports.getTourByID = catchAsync(async(req,res,next)=>{
//     // req.params=> fetch the parameter(id) form URL
//     // console.log(req.params);

//     // converting to the number
//     // const id = req.params.id * 1;
//     const tour = await Tour.findById(req.params.id).populate('reviews');


//     // this is moved to QUERY MIDDLEWARE in tour-model.js
//     // .populate({
//     //     path:'guides',
//     //     select : '-__v -passwordChangedAt'
//     // });

//     if(!tour){
//         return next(new AppError('No tour found with that ID',404));
//     }

//           res.status(200).json({
//             status:'success',
//             data:{
//                 tour
//             }
//         });

//     // fetching data from server for specific ID
//     // const tour = tours.find(el=>el.id === id);


// });

exports.getTourByID = factory.getOne(Tour, { path: 'reviews' })

// create new tour/ posting data to server

// const catchAsync = fn =>{
//     fn(req,res,next).catch(err=>next(err))
// }


// Create New tour

// exports.createNewTour = catchAsync(async (req,res,next)=>{
// //    const newTour = new Tour()
// //    newTour.save()

//     const newTour = await Tour.create(req.body);
//     res.status(201).json({
//             status:'success',
//             data:{
//                 tour:newTour
//             }
//         });

//     // try{

//     // }catch(err){
//     //     res.status(400).json({
//     //         status: 'Failed',
//     //         message: (err,"Invalid Data Sent...!!")
//     //     });
//     // }

//     // res.send('Done');
// });

exports.createNewTour = factory.createOne(Tour);

// Update tour data


// exports.updateTourData = catchAsync(async(req,res,next)=>{
//     // try{
//         const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{new : true,runValidators:true});

//          if(!tour){
//             return next(new AppError('No tour fount with that ID',404));
//         }

//          res.status(200).json({
//         status:"success",
//         data:{
//             tour
//         }
//     });


//     // }catch(err){
//     //      res.status(400).json({
//     //         status: 'Failed',
//     //         message: (err,"Invalid Data Sent...!!")
//     //     });
//     // }


// });


exports.updateTourData = factory.updateOne(Tour);


// Delete tour data

// exports.deleteTourData = catchAsync(async(req,res,next)=>{
//     // try{

//         const tour = await Tour.findByIdAndDelete(req.params.id);

//          if(!tour){
//             return next(new AppError('No tour fount with that ID',404));
//         }

//         res.status(204).json({
//             status:"success",
//             data:null
//         });
//     // }catch(err){
//     //     res.status(400).json({
//     //         status: 'Failed',
//     //         message: (err,"Invalid Data Sent...!!")
//     //     });
//     // }
// });

exports.deleteTourData = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
    // try{

    const stats = await Tour.aggregate([
        {
            $match: {
                ratingsAverage: { $gte: 4.5 }
            }

        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            }
        },
        {
            $sort: {
                // avgPrice : -1 // decending
                avgPrice: 1 //ascending
            }
        },
        // {
        //     $match : {
        //         _id : { $ne: 'EASY' } //$ne=> not equal to
        //     }
        // }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
    // }catch(err){
    //     res.status(400).json({
    //         status: 'Failed',
    //         message: (err,"Data not found...!!")
    //     });
    // }
});


exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    // try{
    const year = req.params.year * 1; //2021
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'

        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }

            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { numTourStarts: -1 }
        },
        // {
        //     $limit : 12
        // }
    ]);

    res.status(200).json({
        status: 'success',
        result: plan.length,
        data: {
            plan
        }
    });
    // }catch(err){
    //     res.status(400).json({
    //         status: 'Failed',
    //         message: (err,"Data not found...!!")
    //     });
    // }
});

// '/tours-within/:distance/center?:latlng/unit/:unit'

// // tours-within?distance=233&center=-40,45&unit-mi

// /tours-within/233/center/34.111850,-118.111560/unit/mi\\

// exports.getTourWithin = catchAsync(async(req, res, next) => {
//     const { distance, latlng, unit } = req.params;
//     const [lat, lng] = latlng.split(',');

//     const radius = unit === 'mi' ? distance/3963.2 : distance/6378.1;

//     if (!lat || !lng) {
//         next(AppError('Please provide latitude and longitude in the format lat,lng.', 400)
//         );
//     }
//     // console.log(distance,lat,lng);

//     const tours = await Tour.find(
//         {
//             starsLocation:
//                 {
//                     $geoWithin:
//                     {
//                         $centerSphere:
//                         [
//                             [lng,lat],
//                             radius
//                         ]
//                     }}})
//     res.status(200).json({
//         status:'success',
//         results: tours.length,
//         data:{
//             data:tours
//         }
//     })
// })

exports.getTourWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',').map(coord => parseFloat(coord));

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
        return next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400));
    }

    const tours = await Tour.find({
        startLocation: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius]
            }
        }
    });

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours
        }
    });
});


exports.getDistance = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',').map(coord => parseFloat(coord));

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;


    if (!lat || !lng) {
        return next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400));
    }

    const distances = await Tour.aggregate([
        {
            $geoNear:{
                near:{
                    type:'Point',
                    coordinates:[lng*1,lat*1 ]
                },
                distanceField:'distance',
                distanceMultiplier:multiplier

            }
        },
        {
            $project:{
                distance:1,
                name:1
            }
        }
    ]);
     res.status(200).json({
        status: 'success',
        data: {
            data: distances
        }
    });
})






















// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));




// exports.checkID = (req,res,next,value)=>{
//     console.log(`Tour ID is : ${value}`);
//     if(req.params.id * 1 > tours.length){
//         return res.status(404).json({
//             status:"fail",
//             message:"Invalid ID"
//         });
//     }
//     next();
// }

// exports.checkBody = (req,res,next)=>{
//     if(!req.body.name || !req.body.price ){
//         return res.status(404).json({
//             status:"Failed",
//             message:"Missing name or price"
//         })
//     }
//     next();
// }