const request = require("supertest");
const app = require("../src/app");
const path = require("../config/test.env");
const dotenv = require("dotenv");
const envPath = path.resolve(__dirname, "test.env");
dotenv.config({ path: envPath });

test("Should signup a new user", async () => {
  try {
    await request(app)
      .post("/users")
      .send({
        name: "aBig Johnson",
        email: "abigJohnson@gmail.com",
        password: "wetJohnny",
        age: "69",
      })
      .expect(201);
  } catch (error) {
    throw new Error(error.message);
  }
});
