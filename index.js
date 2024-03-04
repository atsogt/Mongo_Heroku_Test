import express from "express";
import cors from "cors";
import "dotenv/config";
import { MongoClient } from "mongodb";
import User from "./src/models/user.js";
import mongoose from "mongoose";
import e from "cors";

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

const connectToDB = async () => {
  try {
    await mongoose
      .connect("mongodb://localhost:27017/task-manager-api")
      .then(() => {
        console.log("Connected to database");
      });
  } catch (e) {
    throw new Error(`Error connecting to the database: ${e.message}`);
  }
};

connectToDB();

app.get("/", async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

app.post("/", async (req, res) => {
  const user = await new User(req.body);
  try {
    await user.save();
    res.status(200).send({ user });
  } catch (error) {
    res.status(400).send("Not able to post user nor send email");
  }
});

app.listen(port, () => {
  console.log(`Listening to PORT: ${port}`);
});
