const express = require("express");
const cors = require("cors");
require("./src/db/mongoose.js");
require("dotenv").config();
const userRouter = require("./src/routers/user.js");
const taskRouter = require("./src/routers/task.js");

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Listening to PORT: ${port}`);
});
