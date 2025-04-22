/* eslint-disable prettier/prettier */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable import/no-extraneous-dependencies */
// review / rating / createdAt / Ref to tour / ref to user who wrote the review

const mongoose = require('mongoose');




const bookingSchema = new mongoose.Schema({
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'Booking must belong to a Tour!']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Booking must belong to a User!']
    },
    price:{
        type: Number,
        required:[true,'Boking must have a price.']
    },
    createdAT:{
        type:Date,
        default:Date.now()
    },
    paid:{
        type:Boolean,
        default:true
    }
});

bookingSchema.pre(/^find/,function(next){
    this.populate('user').populate({
        path:'tour',
        select:'name'
    });
    next();
})

const Booking = mongoose.model('Booking',bookingSchema);
module.exports = Booking;