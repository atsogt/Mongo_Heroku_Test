const { mongoose } = require("mongoose");
require("dotenv").config();
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("Connected to database");
    });
  } catch (e) {
    throw new Error(`Error connecting to the database: ${e.message}`);
  }
};

connectToDB();

module.exports = connectToDB;
