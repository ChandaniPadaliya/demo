const sendResponse = require("../../helpers/sendResponse");

const auth = require("./auth");


exports.login = (req, res) => {
  auth
    .login(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};

exports.loginAdmin = (req, res) => {
  auth.adminLogin(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((e) => {
      sendResponse(res, e);
    });
};

exports.resendOtpAdmin = (req, res,) => {
  auth.adminresendOtp(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((e) => {
      sendResponse(res, e);
    });
};

exports.otpVerifyAdmin = (req, res,) => {
  auth.adminverify(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((e) => {
      sendResponse(res, e);
    });
};

exports.forgotPasswordAdmin = (req, res,) => {
  auth.adminforgotPassword(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((e) => {
      sendResponse(res, e);
    });
};

exports.forgotpasswordsetAdmin = (req, res,) => {
  auth.adminforgotPasswordSet(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((e) => {
      sendResponse(res, e);
    });

};

exports.resetpasswordAdmin = (req, res,) => {
  auth.adminresetpassword(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((e) => {
      sendResponse(res, e);
    });
};

