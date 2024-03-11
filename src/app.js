const express = require("express");
const cors = require("cors");
require("./db/mongoose.js");
require("dotenv").config();
const userRouter = require("./routers/user.js");
const taskRouter = require("./routers/task.js");

const app = express();
app.use(cors());
app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

module.exports = app;
