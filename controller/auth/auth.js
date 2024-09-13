const { User } = require("../../models/user.model");
const serviceUser = require("../../services/mongoDbService")({ model: User });
const message = require("../../utils/messages");
const bcrypt = require("bcrypt")
const responceCode = require("../../utils/responseCode");
const { sendmail } = require("../../utils/sendmail")
const { Admin } = require("../../models/admin.model")
const mongoDbserviceAdmin = require("../../services/mongoDbService")({ model: Admin })

exports.login = async (req) => {
  try {
    let reqBody = req.body;
    let query = {};
    if (reqBody.loginType == "Facebook" || reqBody.loginType == "Google" || reqBody.loginType == "Phone" || reqBody.loginType == "Apple") {
      if (reqBody.loginType == "Phone") {
        query = { phone: typeof reqBody.userId == "number" ? reqBody.userId : null, isDeleted: false };
      } else {
        query = { email: reqBody.userId, isDeleted: false };
      }
      let user = await serviceUser.getSingleDocumentByQuery(query);

      if (!user) {
        return message.badRequest(
          responceCode.notFound,
          false
        );
      }

      if (user.loginType != reqBody.loginType) {
        return message.badRequest(
          responceCode.notFound,
          false,
          "your login type is different"
        );
      }

      let token = user.generateToken();
      let returnData = user.toJSON();
      delete returnData.isDeleted;
      delete returnData.loginType;
      delete returnData.__v;

      returnData = {
        ...returnData,
        ...{ token }
      };

      return message.successResponse(
        responceCode.success,
        returnData
      );
    }
    return message.inValidParam(
      responceCode.validationError,
      "login type invalid"
    );
  } catch (error) {
    console.log('error: ', error);
    return message.failureResponse(
      responceCode.internalServerError,
      error
    );
  }
};

exports.adminLogin = async (req) => {
  try {
    let { email, password } = req.body;

    let user = await mongoDbserviceAdmin.getSingleDocumentByQuery({ email });

    if (!user) {
      return message.recordNotFound(
        responceCode.notFound
      );
    }

    let validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return message.loginFailed(
        responceCode.unAuthorizedRequest,
        "email and password are wrong"
      );
    }
    let data = user.toJSON();
    delete data.password;
    delete data.__v;
    let token = user.generateAdminToken();
    return message.loginSuccess(
      responceCode.success,
      { ...data, token }
    );
  } catch (err) {
    console.log("err: ", err);
    return message.failureResponse(
      responceCode.internalServerError);
  }
};

exports.adminresendOtp = async (req) => {
  try {
    let { email } = req.body;

    let user = await mongoDbserviceAdmin.getSingleDocumentByQuery({ email });

    const otp = await sendmail(email);
    console.log("otp: ", otp);

    const token = user.generateCustomerToken();

    user = user.toJSON();
    user.otp = otp;

    await mongoDbserviceAdmin.updateDocument(user._id, user);
    let getUser = await mongoDbserviceAdmin.getSingleDocumentById(user._id);
    console.log(getUser);

    getUser = getUser.toJSON();
    const Data = {
      ...getUser,
      token
    };

    return message.successResponse(
      responceCode.success,
      Data
    );

  } catch (error) {
    console.log("error: ", error);
    return message.failureResponse(
      responceCode.internalServerError
    );
  }
};

exports.adminverify = async (req) => {
  try {
    let { email, otp } = req.body;

    let user = await mongoDbserviceAdmin.getSingleDocumentByQuery({ email });
    if (!user) {
      return message.recordNotFound(
        responceCode.notFound
      );
    }

    if (user.otp != otp) {
      return message.invalidRequest(
        responceCode.badRequest,
        "invalid otp, Enter valid otp"
      );
    }
    user.otp = null;
    user = await mongoDbserviceAdmin.findOneAndUpdateDocument({ _id: user._id }, user);
    const token = user.generateCustomerToken();
    return message.successResponse(
      responceCode.success, { ...user._doc, token }
    );

  } catch (error) {
    console.log("error: ", error);
    return message.failureResponse(
      responceCode.internalServerError
    );
  }
};

exports.adminforgotPassword = async (req) => {
  try {
    const { email } = req.body;

    let query = {};
    query = { email, isDeleted: false };
    let user = await mongoDbserviceAdmin.getSingleDocumentByQuery(query);
    if (!user) return message.recordNotFound(
      responceCode.notFound,
    );

    let mail = await sendmail(email);
    console.log("mail: ", mail);
    user = user.toJSON();
    user.otp = mail;

    mongoDbserviceAdmin.updateDocument(user._id, user);

    return message.requestValidated(
      responceCode.success,
      "otp send your mail"
    );

  } catch (error) {
    console.log("error: ", error);
    return message.inValidParam(
      responceCode.internalServerError,
      error
    );
  }
};

exports.adminforgotPasswordSet = async (req) => {
  try {
    let { password } = req.body;

    let user = await mongoDbserviceAdmin.getSingleDocumentByQuery({ _id: req.user.id });
    if (!user) {
      return message.recordNotFound(
        responceCode.notFound
      );
    }
    if (!password) {
      return message.badRequest(
        responceCode.badRequest
      );
    }
    let salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    user = user.toJSON();
    user.password = password;

    user = await mongoDbserviceAdmin.updateDocument(user._id, user);
    return message.requestValidatedWithData(
      responceCode.success,
      "password update",
    );
  } catch (error) {
    console.log("error: ", error);
    return message.failureResponse(
      responceCode.internalServerError
    );
  }
};

exports.adminresetpassword = async (req) => {
  try {
    let { oldPassword, newPassword, email } = req.body;

    let user = await mongoDbserviceAdmin.getSingleDocumentByQuery({ email });
    if (!user) {
      return message.recordNotFound(
        responceCode.notFound
      );
    }
    let password = await bcrypt.compare(oldPassword, user.password);
    if (!password) {
      return message.invalidRequest(
        responceCode.validationError,
        "invalid password"
      );
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.save();
    if (user.save) {
      return message.requestValidated(
        responceCode.success,
        "password update"
      );
    }
  } catch (error) {
    console.log("error: ", error);
    return message.failureResponse(
      responceCode.internalServerError
    );
  }
};

