import express from "express";
import cors from "cors";
import "dotenv/config";
import { MongoClient } from "mongodb";
import User from "./src/models/user.js";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;
const client = new MongoClient(process.env.MONGO_URI);
const database = client.db("users-test");
const userCollection = database.collection("users");
client
  .connect()
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => console.log("Not Connected to mongoDB", error));

app.get("/", async (req, res) => {
  const users = await userCollection.find().toArray();
  res.json(users);
});

app.post("/", async (req, res) => {
  //
  const user = await new User(req.body);
  try {
    await userCollection.insertOne(user);
    res.status(200).send({ user });
  } catch (error) {
    res.status(400).send("Not able to post user nor send email");
  }
});

app.listen(port, () => {
  console.log(`Listening to PORT: ${port}`);
});
