const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: "Anand Tester",
  email: "atsogt17@gmail.com",
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
  // const userData = {
  //   name: "aBig Johnson",
  //   email: "abigJohnson@gmail.com",
  //   password: "wetJohnny",
  //   age: "69",
  // };

  const response = await request(app)
    .post("/users")
    .send({
      name: "aBig Johnson",
      email: "atsogt24@gmail.com",
      password: "wetJohnny",
      age: 69,
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
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
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for user", async () => {
  const response = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app)
    .delete("/users/me")
    // .set("Authorization", `Bearer 123`)
    .send()
    .expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Adonis",
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toEqual("Adonis");
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "Indianapolis",
    })
    .expect(406);
});
