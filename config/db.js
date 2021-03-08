const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

//mongoose returns promises!
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
    });
    console.log("mongoDB connected...");
  } catch (err) {
    console.error(err.message);
    //exits with failure
    process.exit(1);
  }
};

module.exports = connectDB;
