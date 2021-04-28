const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
    username: {
      type: String,
      unique: true,
      required: [true, 'Username is required.'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required.'],
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['teacher', 'student'],
      required: true,
    },
    imgPath: String,
    publicId: String,
    bookedLessons: [
      { type: Schema.Types.ObjectId, 
      ref: 'Lesson'
      }
    ],
    organisedLessons: [
      { type: Schema.Types.ObjectId, 
        ref: 'Lesson'
      }
    ]
  },
  
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
