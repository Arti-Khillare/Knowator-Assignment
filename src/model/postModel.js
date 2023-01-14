const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
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
    createdBy : {
        type : String,
        require : [true, "createdBy is required"],
        trim : true
    },
    userId: {
        type: ObjectId,
        required: [true, "userId is Required"],
        ref: "User",
    },
    status: {
      type: String,
      trim: true,
      enum: ["Active", "Inactive"],
      default: "Active",
      required: [true, "status is required"],
    },
    geoLocation: {
        latitude : {
            type : String,
            required : ["latitude is required"],
            trim : true
        },
        longitude : {
            type : String,
            required : ["longitude is required"],
            trim : true
        }
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
