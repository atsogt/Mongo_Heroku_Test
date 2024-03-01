import mongoose from "mongoose";
const { Schema } = mongoose;
// const Task = require("./task");

const userSchema = new Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  age: { type: Number },
});

const User = mongoose.model("User", userSchema);
export default User;
