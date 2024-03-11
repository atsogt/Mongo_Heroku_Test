const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: "Anand Tester",
  email: "anand@gmail.com",
  password: "hello123",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.ACCESS_TOKEN_SECRET),
    },
  ],
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

afterAll(async () => {
  await mongoose.connection.close();
});

test("Should signup a new user", async () => {
  const userData = {
    name: "aBig Johnson",
    email: "abigJohnson@gmail.com",
    password: "wetJohnny",
    age: "69",
  };

  const response = await request(app).post("/users").send(userData).expect(201);
});

test("Should login existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
});

test("Should not login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({ email: "test123@gmail.com", password: "test123" })
    .expect(401);
});

test("Should get profile for user", async () => {
  await await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for user", async () => {
  await await request(app).get("/users/me").send().expect(401);
});
