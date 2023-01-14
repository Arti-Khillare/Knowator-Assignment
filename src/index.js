const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const route = require('../src/routes/route')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("strictQuery", false);

const uri = process.env.ATLAS_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDb is successfully connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
