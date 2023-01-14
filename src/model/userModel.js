const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, "first name Is required"],
      lowercase: true,
      trim: true,
    },

    lname: {
      type: String,
      required: [true, "last Name is reequired"],
      lowercase: true,
      trim: true,
    },

    title: {
      type: String,
      enum: ["Mr", "Mrs", "Miss", "Mast"],
      required: [true, "title is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email !");
        }
      },
    },
    password: {
      type: String,
      trim: true,
      required: [true, "password is required"],
      minlength: [6, "minimum length of password should be 6"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
