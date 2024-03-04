import express from "express";
import User from "../models/user.js";
const router = new express.Router();

router.get("/user", async (req, res) => {
  const users = await User.find({});
  console.log(users);
  res.json(users);
});

router.post("/user", async (req, res) => {
  const user = await new User(req.body);
  try {
    await user.save();
    res.status(200).send({ user });
  } catch (error) {
    res.status(400).send("Not able to post user nor send email");
  }
});

export { router };
