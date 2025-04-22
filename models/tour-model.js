/* eslint-disable prettier/prettier */
  /* eslint-disable prefer-arrow-callback */
  /* eslint-disable no-console */
  /* eslint-disable prettier/prettier */
  /* eslint-disable import/no-extraneous-dependencies */
  /* eslint-disable no-unused-vars */
  /* eslint-disable prettier/prettier */
  // eslint-disable-next-line import/no-extraneous-dependencies
  const mongoose = require('mongoose');
  const slugify = require('slugify');
  const validator = require('validator');
// If user-module.js is in the same 'models' folder
const User = require('./user-module'); 

  // creating new schema
  const tourSchema = new mongoose.Schema({
    name:{
      type:String,
      required: [true, 'A tour must have a name'],
      unique:true,
      trim:true,
      maxlength:[40,"A tour name must less or equal than 40 characters."],
      minlength:[10,"A tour name must greater or equal than 10 characters."],
      // validate:[validator.isAlpha,'Tour name only contains characters.']
    },
    slug: String,
    duration:{
      type:Number,
      required:[true,"A tour must have a duration"]
    },
    maxGroupSize:{
      type:Number,
      required:[true,"A tour must have a group size"]
    },
    difficulty:{
      type : String,
      required:[true,"A tour must have  a difficulty"],
      enum:{
        values:['easy','medium','difficult'],
        message: 'Difficulty is either: easy,medium or difficult'
      }
    },
    ratingsAverage:{
      type: Number,
      default : 4.5,
      min:[1,'Rating must be above 1.0'],
      mac:[5,'Rating must be less than or equal to 5.0'],
      set:value=>Math.round(value * 10) / 10

    },
    ratingsQuantity:{
      type: Number,
      default : 0
    },
    price:{
        type:Number,
        required:[true,"A tour must have a price"]
    },
    priceDiscount:{
      type:Number,
      validate: function(val){
        // this keyword only points to current doc on new document creation
        return val<this.price ; // 100<200=>true || 250<200=>false 
      },
      message: 'Discount price({value}) should be below regular price.'
    },
    summary:{
      type:String,
      trim:true,
      required:[true,"A tour must have Summary"]
    },
    description:{
      type:String,
      trim:true
    },
    imageCover:{
      type:String,
      required:[true,"A tour must have a Cover Image."]
    },
    images:[String],
    createdAt:{
      type:Date,
      default:Date.now(),
      select: false
    },
    startDates:[Date],
    secretTour:{
      type: Boolean,
      default:false
    },
    startLocation:{
      // GEO JSON
      type:{
        type:String,
        default:'Point',
        enum :['Point']
      } ,
      coordinates:[Number],
      address:String,
      description : String
    },
    locations:[
      {
        type:{
          type:String,
          default:'Point',
          enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description : String,
        day : Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User"
      }
    ]
    // reviews:[
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref:"Review"
    //   }
    // ]
  },{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
  }); 


  // Creating virtual property

// tourSchema.index({price:1});
tourSchema.index({price:1,ratingsAverage:-1});
tourSchema.index({slug:1});
tourSchema.index({startLocation: '2dsphere'});


  tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
  });

// virtual populate
  tourSchema.virtual('reviews',{
    ref:"Review",
    foreignField: "tour",
    localField:"_id"
  })

  //DOCUMENT MIDDLEWARE : runs before save() command and create() 
  tourSchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower: true});
    next();
  });

  // tourSchema.pre('save',function(next){
  //   const guidesPromises = this.guides.map( async id => User.findById(id));

  //   this.guides= await Promise.all(guidesPromises);

  //   next();
  // });


  // tourSchema.pre('save', async function(next) {
  //   const guidesPromises = this.guides.map(async id => await User.findById(id));
  //   this.guides = await Promise.all(guidesPromises);
  //   next();
  // });



  // tourSchema.pre('save',function(next){
  //   console.log('Will save document ...');
  //   next();
  // });

  //  Runs after save() and create() function.
  // tourSchema.post('save',function(doc,next){
  //   console.log(doc);
  //   next();
  // });


  // QUERY MIDDLEWARE

  // tourSchema.pre('find',function(next){
  tourSchema.pre(/^find/,function(next){
    this.find({secretTour:{$ne:true}});
    this.start = Date.now()
    next();
  })

  tourSchema.pre(/^find/,function(next){
    this.populate({
        path:'guides',
        select : '-__v -passwordChangedAt'
    });
    next();
  });

  tourSchema.post(/^find/,function(doc,next){
    console.log(`Query took ${Date.now() - this.start } milliseconds`)
    // console.log(doc);
    next();
  });



  // // AGGRIGATION MIDDLEWARE
  // tourSchema.pre('aggregate',function(next){
  //   this.pipeline().unshift({
  //     $match:{secretTour:{$ne:true}}
  //   })
  // //  console.log(this.pipeline());
  // next(); 
  // });

  // Creating model
  const Tour = mongoose.model('Tour',tourSchema);


  module.exports = Tour;





  // creating document
  // const testTour = new Tour({
  //   name:"The Park Camper",
  //   rating: 7.5,
  //   price: 777
  // });

  // // saving document to database
  // testTour.save()
  //   .then(doc=>{
  //     console.log(doc);
  //   })
  //   .catch(err=>{
  //     console.log("ERROR...!!💥",err);
  //   });