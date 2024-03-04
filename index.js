const express = require("express");
const cors = require("cors");
require("./src/db/mongoose.js");
require("dotenv").config();
const userRouter = require("./src/routers/user.js");

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;
// const client = new MongoClient(process.env.MONGO_URI);
// const database = client.db("task-manager-api");
// const userCollection = database.collection("users");
// client
//   .connect()
//   .then(() => {
//     console.log("connected to mongodb");
//   })
//   .catch((error) => console.log("Not Connected to mongoDB", error));

// const connectToDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI).then(() => {
//       console.log("Connected to database");
//     });
//   } catch (e) {
//     throw new Error(`Error connecting to the database: ${e.message}`);
//   }
// };

// connectToDB();

app.use(userRouter);

app.listen(port, () => {
  console.log(`Listening to PORT: ${port}`);
});
