const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const validate = require("validator");

const isValid = (value) => {
  if (typeof value === "undefined" || value === null) return false;

  if (typeof value === "string" && value.trim().length === 0) {
    return false;
  }
  return true;
};

const isValidTitle = (title) => {
  return ["Mr", "Mrs", "Miss", "Mast"].indexOf(title) !== -1;
};

const isValidRequestBody = (requestBody) => {
  return Object.keys(requestBody).length > 0;
};

const createUser = async (req, res) => {
  try {
    let requestBody = req.body;
    if (!isValidRequestBody(requestBody)) {
      return res.status(400).send({
        status: false,
        msg: "invalid request parameters . Please Provide User Details",
      });
    }

    //// Extracting Params ////

    const { fname, lname, title, email, password } = requestBody;

    ////      Validating....     ////

    if (!isValid(fname)) {
      res
        .status(400)
        .send({ Status: false, message: "First Name is required" });
      return;
    }

    if (!isValid(lname)) {
      res.status(400).send({ Status: false, message: "Last Name is required" });
      return;
    }

    if (!isValid(title)) {
      res.status(400).send({ Status: false, message: "Title is required" });
      return;
    }

    if (!isValidTitle(title)) {
      res.status(400).send({
        Status: false,
        message: "Title Should Be Among Mr , Mrs , Miss And Mast",
      });
      return;
    }

    if (!isValid(email)) {
      res.status(400).send({ Status: false, message: "Email is required" });
      return;
    }

    if (!validate.isEmail(email)) {
      return res.status(400).send({ status: false, msg: "Invalid Email" });
    }

    if (!isValid(password)) {
      res.status(400).send({ Status: false, message: "Password Is Required" });
      return;
    }

    const isEmailAlreadyUsed = await userModel.findOne({ email });

    if (isEmailAlreadyUsed) {
      res
        .status(400)
        .send({ Status: false, message: `${email} is Already Registerd` });
      return;
    }

    // Validation Ends

    const userData = { fname, lname, title, email, password };
    const newUser = await userModel.create(userData);
    res.status(201).send({
      status: true,
      message: "User Created Successfully",
      data: newUser,
    });
  } catch (err) {
    res.status(500).send({ Status: false, message: err.message });
  }
};

////   login_Part   ////

const loginUser = async function (req, res) {
  try {
    const requestBody = req.body;

    if (!isValidRequestBody(requestBody)) {
      res.status(400).send({
        status: false,
        message: "invalid request parameters . Please Provide login Details",
      });
    }

    const { email, password } = requestBody;

    if (!isValid(email)) {
      res.status(400).send({ Status: false, message: "Email Is Required" });
      return;
    }

    if (!validate.isEmail(email)) {
      return res.status(400).send({ status: false, msg: "Invalid Email" });
    }

    if (!isValid(password)) {
      res.status(400).send({ Status: false, message: "Password Is Required" });
      return;
    }

    let User = await userModel.findOne({ email, password });

    if (!User)
      return res.status(404).send({
        status: false,
        msg: "user Not Found , plz check Credintials",
      });

    const maxAge = 48 * 60 * 60;
    const token = jwt.sign(
      { userId: User._id, email },
      "secretKey", //jwtSecret,
      {
        expiresIn: maxAge,
      }
    );
    res.setHeader("Authorization", token);
    res
      .status(200)
      .send({ status: true, message: "User login SuccesFull", data: token });
  } catch (error) {
    return res.status(500).send({ Status: false, message: error.message });
  }
};

module.exports = { createUser, loginUser };
