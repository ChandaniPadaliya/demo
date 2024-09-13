const express = require("express")
const route = express.Router()
const auth = require("../controller/auth")

route.post("/sign-in", auth.loginAdmin);
route.post("/otp-resend", auth.resendOtpAdmin);
route.post("/forgot-password", auth.forgotPasswordAdmin);
route.post("/otp-verify", auth.otpVerifyAdmin);
route.post("/forgot-password-set", auth.forgotpasswordsetAdmin);
route.post("/reset-password", auth.resetpasswordAdmin);


module.exports = route