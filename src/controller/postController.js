const postModel = require("../model/postModel");
const userModel = require("../model/userModel");
const { default: mongoose } = require("mongoose");
const { query } = require("express");

const isValid = (value) => {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isValidRequestBody = (requestBody) => {
  return Object.keys(requestBody).length > 0;
};

const isValidobjectId = (objectId) => {
  return mongoose.Types.ObjectId.isValid(objectId);
};

////   creating_Post   /////

const createPost = async (req, res) => {
  try {
    let requestBody = req.body;

    const userIdFromToken = req.userId;

    if (!isValidobjectId(userIdFromToken)) {
      res.status(400).send({
        status: false,
        message: `${userIdFromToken} is Not a Valid token id`,
      });
      return;
    }

    if (!isValidRequestBody(requestBody)) {
      res.status(400).send({
        status: false,
        message: "Invalid request parameteres . please provide post details",
      });
      return;
    }

    const { title, body, createdBy, userId, geoLocation } = requestBody;

    if (userId != userIdFromToken) {
      res.status(401).send({ status: false, message: "Unauthroized Access" });
      return;
    }

    if (!isValid(title)) {
      res
        .status(400)
        .send({ status: false, message: "Post Title Is Required" });
      return;
    }

    if (!isValid(body)) {
      res.status(400).send({ status: false, message: "Post body Is Required" });
      return;
    }

    if (!isValid(createdBy)) {
      res.status(400).send({ status: false, message: "createdby Is Required" });
      return;
    }

    if (!isValid(userId)) {
      res.status(400).send({ status: false, message: "user Id Is Required" });
      return;
    }

    if (!isValidobjectId(userId)) {
      res.status(400).send({
        status: false,
        message: `${userId} is Not a Valid userId`,
      });
      return;
    }

    if (!isValid(geoLocation.latitude) || !isValid(geoLocation.longitude)) {
      return res.status(400).send({
        status: false,
        message: " location must be filled ",
      });
    }

    let user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).send({ msg: "user Not Found" });
    }

    const postData = {
      title,
      body,
      createdBy,
      userId,
      geoLocation,
    };

    let postCreated = await postModel.create(postData);
    if (!postCreated) {
      return res.status(400).send({ Status: false, msg: "Invalid Request" });
    }
    return res.status(201).send({
      Status: true,
      message: "post Created Successfully",
      data: postCreated,
    });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

////    getting posts   ////

const getPosts = async function (req, res) {
  try {
    const getInfo = await postModel.find({ isDeleted: false });

    return res.status(200).send({
      status: true,
      message: "postinfo details fetched",
      data: getInfo,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: "Error", error: error.message });
  }
};

////     Updating_Post       ////

const updatePosts = async (req, res) => {
  try {
    const requestBody = req.body;
    const params = req.params;
    const postId = params.postId;
    const userIdFromToken = req.userId;

    // validations...

    if (!isValidobjectId(postId)) {
      res
        .status(400)
        .send({ status: false, message: `${postId} is Not a Valid post id` });
      return;
    }

    if (!isValidobjectId(userIdFromToken)) {
      res.status(400).send({
        status: false,
        message: `${userIdFromToken} is Not a Valid token id`,
      });
      return;
    }

    const post = await postModel.findOne({
      _id: postId,
      isDeleted: false,
    });

    if (!post) {
      res.status(404).send({ status: false, message: "post Not Found" });
      return;
    }

    if (post.userId.toString() !== userIdFromToken) {
      res.status(401).send({
        status: false,
        message: "Unauthorized access ! Owner Info dosent match",
      });
      return;
    }

    if (!isValidRequestBody(requestBody)) {
      res.status(200).send({
        status: false,
        message: "No parameters Passed. post unmodified",
        Data: post,
      });
      return;
    }

    ////  Extracting Params  ////

    const { title, body, createdBy, status } = requestBody;

    const updatePostData = {};

    if (isValid(title)) {
      if (!Object.prototype.hasOwnProperty.call(updatePostData, "$set"))
        updatePostData["$set"] = {};
      updatePostData["$set"]["title"] = title;
    }

    if (isValid(body)) {
      if (!Object.prototype.hasOwnProperty.call(updatePostData, "$set"))
        updatePostData["$set"] = {};
      updatePostData["$set"]["body"] = body;
    }

    if (isValid(createdBy)) {
      if (!Object.prototype.hasOwnProperty.call(updatePostData, "$set"))
        updatePostData["$set"] = {};
      updatePostData["$set"]["createdBy"] = createdBy;
    }

    if (isValid(status)) {
      if (!Object.prototype.hasOwnProperty.call(updatePostData, "$set"))
        updatePostData["$set"] = {};
      updatePostData["$set"]["status"] = status;
    }

    const updatedPost = await postModel.findOneAndUpdate(
      { _id: postId },
      updatePostData,
      { new: true }
    );
    res.status(200).send({
      status: true,
      message: "Post Updated Successfully",
      data: updatedPost,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

const getPostByStatus = async (req, res) => {
  try {
    const userIdFromToken = req.userId;

    if (!isValidobjectId(userIdFromToken)) {
      res.status(400).send({
        status: false,
        message: `${userIdFromToken} is Not a Valid token id`,
      });
      return;
    }

    if (req.userId != userIdFromToken) {
      res.status(401).send({ status: false, message: "Unauthroized Access" });
      return;
    }

    const activeData = await postModel.find({
      status: "Active",
      isDeleted: false,
    });
    const inactiveData = await postModel.find({
      status: "Inactive",
      isDeleted: false,
    });

    const countOfActives = activeData.length;
    const countOfInactives = inactiveData.length;
    let finalData = { countOfActives, countOfInactives };

    res
      .status(200)
      .send({ status: true, data: activeData, inactiveData, finalData });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};
////    Deleting_data     ////

const deleteById = async (req, res) => {
  try {
    const params = req.params;
    const postId = params.postId;
    const userIdFromToken = req.userId;

    if (!isValidobjectId(postId)) {
      res
        .status(400)
        .send({ status: false, message: `${postId} is Not a valid Blog Id` });
      return;
    }

    if (!isValidobjectId(userIdFromToken)) {
      res.status(400).send({
        status: false,
        message: `${userIdFromToken} is Not a valid token Id`,
      });
      return;
    }

    const post = await postModel.findOne({
      _id: postId,
      isDeleted: false,
    });

    if (!post) {
      res.status(404).send({ status: false, message: "post not found" });
      return;
    }

    if (post.userId.toString() !== userIdFromToken) {
      res.status(401).send({
        status: false,
        message: "unauthorized access! Owner info Doesnt Match",
      });
      return;
    }

    const deletedata = await postModel.findOneAndUpdate(
      { _id: postId, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );
    res
      .status(200)
      .send({
        status: false,
        message: "Post Deleted Successfully",
        data: deletedata,
      });
  } catch (error) {
    res.status(500).send({ Err: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostByStatus,
  updatePosts,
  deleteById,
};
