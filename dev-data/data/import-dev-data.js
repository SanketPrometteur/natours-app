/* eslint-disable prettier/prettier */
/* eslint-disable no-empty */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const Tour = require('./../../models/tour-model');
const User = require('./../../models/user-module');
const Review = require('./../../models/review-model');


dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    // useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful...!'));

//   Read JSON file.
  const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));

  const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'));

  const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'));


//   import data into DB
  const importData = async ()=>{
    try{
        await Tour.create(tours);
        await User.create(users,{validateBeforeSave:false});
        await Review.create(reviews);
        console.log('Data successfully loaded...!!');
    }catch(err){
        console.log('Error while inserting data',err);
    }
    process.exit();
  }


//   Delete all data from DB
const deleteData = async ()=>{
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data successfully Deleted...!!');
    }catch(err){
        console.log('Error while deleting data',err);
    }
    process.exit();
  }

  if(process.argv[2] === '--import'){
    importData();
  }else if (process.argv[2]==='--delete'){
    deleteData();
  }

  console.log(process.argv);



