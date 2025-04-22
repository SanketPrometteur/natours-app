/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose')
const dotenv = require('dotenv');


process.on('uncaughtException',err=>{
    console.log('UNCAUGHT EXCEPTION 💥💥 Shutting Down...!')
    console.log(err.name,err.message);
    process.exit(1);
    
});

dotenv.config({path: './config.env'});
const app = require('./app')


const DB = process.env.DATABASE;
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
.then(()=>console.log('DB connection successful...!'))

// .catch(err=>{
//   console.log("ERROR");
// });


// console.log(process.env.NODE_ENV);
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
 

process.on('unhandledRejection',err=>{
  console.log('UNHANDLER REJECTION 💥💥 Shutting Down...!')
  console.log(err);
  server.close(()=>{
    process.exit(1);
  });
});





 
  