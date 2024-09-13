/* eslint-disable no-unused-vars */
const messages = module.exports = {};
messages.successResponse = (statusCode, data, message) => ({
  "Content-Type": "application/json",
  statusCode,
  data: {
    status: "SUCCESS",
    message: message ? message : "Your request is successfully executed",
    data,
  },
});

messages.successResponsewithMeta = (statusCode, data, meta = {}) => ({
  "Content-Type": "application/json",
  statusCode,
  data: {
    status: "SUCCESS",
    message: "Your request is successfully executed",
    data,
    meta,
  },
});
messages.failureResponse = (statusCode, error) => ({
  "Content-Type": "application/json",
  statusCode,
  data: {
    status: "FAILURE",
    message: "Internal Server Error " + error,
    data: {},
  },
});
messages.badRequest = (statusCode, error) => ({
  "Content-Type": "application/json",
  statusCode,
  data: {
    status: "BAD_REQUEST",
    message: error ? "The request cannot be fulfilled due to bad syntax " + error : "The request cannot be fulfilled due to bad syntax",
    data: {},
  },
});

messages.isDuplicate = (statusCode) => ({
  "Content-Type": "application/json",
  statusCode,
  data: {
    status: "VALIDATION_ERROR",
    message: "Data duplication Found",
    data: {},
  },
});

messages.isAssociated = (statusCode) => ({
  "Content-Type": "application/json",
  statusCode,
  data: {
    status: "CONFLICT",
    message: "Authentication data are already associated with another account.",
    data: {},
  },
});

messages.associatedWithMsg = (statusCode, data) => ({
  "Content-Type": "application/json",
  statusCode,
  data: {
    status: "CONFLICT",
    message: data,
    data: {},
  },
});

messages.recordNotFound = (statusCode) => ({
  "Content-Type": "application/json",
  statusCode,
  data: {
    status: "RECORD_NOT_FOUND",
    message: "Record not found with that criteria.",
    data: {},
  },
});
messages.insufficientParameters = (statusCode) => ({
  "Content-Type": "application/json",
  statusCode,
  data: {
    status: "BAD_REQUEST",
    message: "Insufficient parameters",
    data: {},
  },
});

messages.mongoError = (statusCode) => ({
  "Content-Type": "application/json",
  statusCode,
  data: {
    status: "FAILURE",
    message: "Mongo db related error",
    data: {},
  },
});
messages.inValidParam = (statusCode, error) => ({
  "Content-Type": "application/json",
  statusCode,
  data: {
    status: "VALIDATION_ERROR",
    message: error,
    data: {},
  },
});

messages.unAuthorizedRequest = (statusCode) => ({
  "Content-Type": "application/json",
  statusCode,
  data: {
    status: "UNAUTHORIZED",
    message: "You are not authorized to access the request",
    data: {},
  },
});

messages.registartionSuccess = (statusCode, data) => ({
  "Content-Type": "application/json",
  statusCode,
  data: {
    status: "SUCCESS",
    message: "Registration Successful",
    data,
  },
});

messages.loginSuccess = (statusCode, data) => ({
  "Content-Type": "application/json",
  statusCode,
  data: {
    status: "SUCCESS",
    message: "Login Successful",
    data,
  },
});
messages.passwordEmailWrong = (statusCode) => ({
  "Content-Type": "application/json",
  statusCode,
  data: {
    status: "BAD_REQUEST",
    message: "Incorrect email or password",
    data: {},
  },
});
messages.loginFailed = (statusCode, error) => ({
  "Content-Type": "application/json",
  statusCode,
  data: {
    status: "BAD_REQUEST",
    message: `Login Failed, ${error}`,
    data: {},
  },
});
messages.failedSoftDelete = (statusCode) => ({
  "Content-Type": "application/json",
  statusCode,
  data: {
    status: "FAILURE",
    message: "Data can not be soft deleted due to internal server error",
    data: {},
  },
});
messages.invalidRequest = (statusCode, error) => ({
  "Content-Type": "application/json",
  statusCode,
  data: {
    status: "FAILURE",
    message: error,
    data: {},
  },
});
messages.requestValidated = (statusCode, data) => ({
  "Content-Type": "application/json",
  statusCode,
  data: {
    status: "SUCCESS",
    message: data,
    data: {},
  },
});
messages.requestValidatedWithData = (statusCode, message, data) => ({
  "Content-Type": "application/json",
  statusCode,
  data: {
    status: "SUCCESS",
    message,
    data,
  },
});

messages.requestValidatedWithDatawithMeta = (statusCode, message, data, meta = {}) => ({
  "Content-Type": "application/json",
  statusCode,
  data: {
    status: "SUCCESS",
    message,
    data,
    meta
  },
});
