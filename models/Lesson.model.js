const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const geocoder = require('../utils/geocoder');


const lessonSchema = new Schema({
    name: String,
    description: String,
    location: String,
    dateAndTime: Date,
    date: String,
    time: String,
    maxParticipants: Number,
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  // status: {
  //   type: String,
  //   enum: ['online-class', 'offline-class'],
  //   required: true,
  // },

  // student: [
  // {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User'
  // }
  // ],
  address: {
    type: String,
     required: [true, 'Please add an address']
},
  location: {
    type: {
        type: String,
        enum: ['Point']
    },
    coordinates: {
        type: [Number],
        index: '2dsphere'
    },
    formattedAddress: String
  },
createdAt: {
    type: Date,
    default: Date.now()
},
 students: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
});


// Before saving, convert address to geoCode
 lessonSchema.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress
  };

  // Do not save address
  this.address = undefined;
  next();
});

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;