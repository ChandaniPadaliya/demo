const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 993,//*/465,
//   secure: true, // use SSL
//   auth: {
//     user: process.env.USER_MAIL,
//     pass: process.env.USER_PASS,
//   },
// });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.USER_MAIL, // sender mail
    clientId: process.env.ClientID,
    clientSecret: process.env.ClientSecret,
    refreshToken: process.env.RefreshToken,
    accessToken: process.env.accessToken,
  },
});

module.exports = transporter;
