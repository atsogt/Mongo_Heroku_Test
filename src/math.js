const calculateTip = (total, tipPercent = 0.2) => total + total * tipPercent;

const fahrenheitToCelsius = (temp) => {
  return (temp - 32) / 1.8;
};

const celsiusToFahrenheit = (temp) => {
  return temp * 1.8 + 32;
};

const add = (a, b) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (a < 0 || b < 0) {
        return rej("Number must be positive");
      }
      return res(a + b);
    }, 2000);
  });
};

//
// Goal: Test temperature conversion functions
//
// 1. Export both functions and load them into test suite
// 2. Create "Should convert 32 F to 0 C"
// 3. Create "Should convert 0 C to 32 F"
// 4. Run the Jest to test your work!

module.exports = {
  calculateTip,
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  add,
};
