const {
  calculateTip,
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  add,
} = require("../src/math");

//global test function provided by jest
test("Should calculate total with tip", () => {
  const total = calculateTip(100, 0.3);
  expect(calculateTip(10, 0.3)).toBe(13);
});

test("Should calculate total with default tip", () => {
  const total = calculateTip(100, 0.3);
  expect(calculateTip(10)).toBe(12);
});

test("Should convert F to C", () => {
  const temp = fahrenheitToCelsius(32);
  expect(temp).toBe(0);
});

test("Should convert C to F", () => {
  const result = celsiusToFahrenheit(20);
  expect(celsiusToFahrenheit(20)).toBe(result);
});

// test("Async test demo", async () => {
//   const result = await setTimeout((done) => {
//     expect(2).toBe(2);
//   }, 1000);
//   result.unref();
// });

test("Should add two numbers", async () => {
  const sum = await add(2, 5);
  expect(sum).toBe(7);
});
