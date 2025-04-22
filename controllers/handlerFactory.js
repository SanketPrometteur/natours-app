/* eslint-disable prettier/prettier */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable no-undef */
// Delete tour data

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/app-error');
const APIFeatures = require('./../utils/api-features');



exports.deleteOne = Model =>
    catchAsync(async(req,res,next)=>{
        const doc = await Model.findByIdAndDelete(req.params.id);

         if(!doc){
            return next(new AppError('No document found with that ID',404));
        }

        res.status(204).json({
            status:"success",
            data:null
        });
});


exports.updateOne = Model => catchAsync(async(req,res,next)=>{
        const doc = await Model.findByIdAndUpdate(req.params.id,req.body,{new : true,runValidators:true});

         if(!doc){
            return next(new AppError('No document fount with that ID',404));
        }

         res.status(200).json({
        status:"success",
        data:{
            data : doc
        }
    });
});


exports.createOne = Model =>
     catchAsync(async (req,res,next)=>{

    const newDoc = await Model.create(req.body);
    res.status(201).json({
            status:'success',
            data:{
                data:newDoc
            }
        });
});

exports.getOne = (Model,populateOptions)=>catchAsync(async(req,res,next)=>{
    let query =  Model.findById(req.params.id);

    if(populateOptions)query=query.populate(populateOptions);

    const doc = await query;

    if(!doc){
        return next(new AppError('No document found with that ID',404));
    }
        
          res.status(200).json({
            status:'success',
            data:{
                data:doc
            }
        });
});


exports.getAll = Model =>catchAsync(async(req,res,next)=>{

    // to allow nested GET Reviews on tours (hack)
    let filter={};
    if(req.params.tourID )filter = {tour : req.params.tourID}
    
        // 5]EXECUTE QUERY
        const features = new APIFeatures(Model.find(filter),req.query).filter().sort().limitFields().paginate();

        // const doc = await features.query.explain();
        const doc = await features.query;

        // 6] SEND RESOPNSE
        res.status(200).json({
            status:'success',
            result:doc.length,
            data:{
                data:doc
            }
        });
});
