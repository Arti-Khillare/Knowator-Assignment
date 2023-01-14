const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title Is Required"],
      trim: true,
    },

    body: {
      type: String,
      required: [true, "Body Should Not Be Empty"],
      trim: true,
    },
    status: {
      type: String,
      trim: true,
      enum: ["Active", "Inactive"],
      default: "Active",
      required: [true, "status is required"],
    },
    geoLocation: {
      type: String,
      trim: true,
      enum: ["Latitude", "Longitude"],
      required: [true, "geoLocation is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
