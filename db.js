const mongoose = require("mongoose");
require("dotenv").config();

// const mongoURL = "mongodb://0.0.0.0:27017/hotels";
const mongoURL = process.env.MONGODB_URL_LOCAL;
// const mongoURL = process.env.MONGODB_URL
// const mongoURL = "mongodb+srv://akashmnit25:Akash123@cluster0.24cpsqy.mongodb.net/";

mongoose.connect(mongoURL, {
  // useNewUrlParser:true,
  // useUnifiedTopology:true
});

const db = mongoose.connection;

// define event listener for database connection

db.on("connected", () => {
  console.log("connected to mongodb server");
});
db.on("error", (err) => {
  console.log("mongodb connection error");
});
db.on("disconnected", () => {
  console.log("mongodb disconnected");
});

// export to database connection

module.exports = db;
