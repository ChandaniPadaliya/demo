const { Like } = require("../../models/like.model");
const serviceLike = require("../../services/mongoDbService")({ model: Like });
const message = require("../../utils/messages");
const responceCode = require("../../utils/responseCode");

exports.getlikeAll = async (req,) => {
  try {
    let { id } = req.params
    let userLike;
    if (id) {
      userLike = await serviceLike.getSingleDocumentByQueryPopulate(
        { user: id },
        ["yourLike"],
        [
        ]);
    } else {
      userLike = await serviceLike.getSingleDocumentByQueryPopulate(
        {},
        [],
        [{
          path: "like",
          select: "_id fullName address profile  lifestyle birthDate  about profession gender email age"
        }, {
          path: "disLike",
          select: "_id fullName address profile  lifestyle birthDate  about profession gender email age"
        },
        {
          path: "superLike",
          select: "_id fullName address profile  lifestyle birthDate  about profession gender email age"
        },
        {
          path: "yourLike",
          select: "_id fullName address profile  lifestyle birthDate  about profession gender email age"
        },
        ]);
    }

    return message.successResponse(
      responceCode.success,
      userLike
    );
  } catch (error) {
    message.failureResponse(
      responceCode.internalServerError,
      "somthing went to wroung" + error
    );
  }
};

exports.getlikeByUid = async (req,) => {
  try {
    let reqUser = req.user;

    let userLike = await serviceLike.getSingleDocumentByQueryPopulate(
      { user: reqUser._id.toString() },
      [],
      [{
        path: "like",
        select: "_id fullName address profile  lifestyle birthDate  about profession gender email age"
      }, {
        path: "disLike",
        select: "_id fullName address profile  lifestyle birthDate  about profession gender email age"
      }, {
        path: "superLike",
        select: "_id fullName address profile  lifestyle birthDate  about profession gender email age"
      },
      {
        path: "yourLike",
        select: "_id fullName address profile  lifestyle birthDate  about profession gender email age"
      },]);

    if (!userLike) {
      return message.successResponse(
        responceCode.success,
        {}
      );
    }
    return message.successResponse(
      responceCode.success,
      userLike
    );
  } catch (error) {
    message.failureResponse(
      responceCode.internalServerError,
      "somthing went wrong" + error
    );
  }
};