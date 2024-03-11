const express = require("express");
const router = new express.Router();
const User = require("../models/user");
// import { auth } from "../middleware/auth.js";
const sharp = require("sharp");
const auth = require("../middleware/auth");
const multer = require("multer");
const { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account");

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error("Please upload a image file"));
    }
    cb(undefined, true);
  },
});

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

router.post("/users", async (req, res) => {
  const user = await new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    res.status(201).send({ user });
  } catch (error) {
    res.status(400).send("Not able to post user nor send email");
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(401).send(error);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    //filetering out token
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res
      .status(200)
      .send("All tokens deleted. User is logged out of every device");
  } catch (error) {
    res.status(500).send();
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ Error: error.message });
  }
);

router.patch("/users/me", auth, async (req, res) => {
  //grabs keys
  const updates = Object.keys(req.body);
  // console.log(updates);
  const allowedUpdates = ["name", "email", "age", "password"];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(406).send({ updateMessage: "Update not allowed" });
  }

  try {
    const user = req.user;
    //dynamic update
    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    user.save();

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete(
  "/users/me/avatar",
  auth,
  async (req, res) => {
    req.user.avatar = undefined;
    await req.user.remove();
    res.send("Deleted profile avatar");
  },
  (error, req, res, next) => {
    res.status(400).send({ Error: error.message });
  }
);

router.delete("/users/me", auth, async (req, res) => {
  const user = req.user;
  // console.log("hit");
  // console.log(user);
  try {
    sendCancelationEmail(user.email, user.name);
    await req.user.deleteOne({ _id: user._id });
    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
