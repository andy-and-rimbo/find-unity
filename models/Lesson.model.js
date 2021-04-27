const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const lessonSchema = new Schema({
    name: String,
    description: String,
    location: String,
    date: Date,
    time: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  // status: {
  //   type: String,
  //   enum: ['online-class', 'offline-class'],
  //   required: true,
  // },
    students: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]

}) 

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;