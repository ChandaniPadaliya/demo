const transporter = require("../config/nodemailer");
/**
 * otp send in mail 
 */
exports.sendmail = (email) => {
  return new Promise((resolve, reject) => {
    let otpcode = Math.floor(Math.random() * 10000);
    if (otpcode.toString().length < 4) {
      otpcode = Math.floor(Math.random() * 10000);
    }

    const mailOptions = {
      from: process.env.USER_MAIL, // sender address
      to: email, // list of receivers
      subject: process.env.SUBJECT, // Subject line
      html:
        "<p>Your Food OTP is : <b>" +
        otpcode +
        "</b>,<br/>" +
        "This OTP is valid for 1 minutes,<br/> Thank you for using FoodApp.</p>",
    };

    // transporter.sendMail(mailOptions, (err) => {
    //   if (err) reject(err.message);
    // });
    resolve(1111);
  });
};
