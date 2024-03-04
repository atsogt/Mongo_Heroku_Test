const express = require("express");
const User = require("../models/user");
// import { auth } from "../middleware/auth.js";
const auth = require("../middleware/auth");
const router = new express.Router();

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  console.log("HIT");
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  console.log("Login Hit");
  try {
    // console.log(req.body.email);
    // console.log(req.body.password);
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    console.log(user);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
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

module.exports = router;
