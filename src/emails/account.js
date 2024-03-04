const nodemailer = require("nodemailer");
let config = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};
const transporter = nodemailer.createTransport(config);

let sendWelcomeEmail = async (email, name) => {
  let message = {
    subject: "Thank you for signing up!", // Subject line
    from: process.env.EMAIL, // sender address
    to: email, // list of receivers
    text: `Welcome to the app, ${name}! Hope you enjoy your own personal task app.`,
  };
  await transporter.sendMail(message);
};

let sendCancelationEmail = async (email, name) => {
  let message = {
    subject: "You're account is cancelled!", // Subject line
    from: process.env.EMAIL, // sender address
    to: email, // list of receivers
    text: `We're sorry to see you go, ${name}! Please tell use why you cancelled your account.`, // html body
  };
  await transporter.sendMail(message);
};

module.exports = { sendWelcomeEmail, sendCancelationEmail };
