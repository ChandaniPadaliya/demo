const { Like } = require("../../models/like.model");
const { User } = require("../../models/user.model");
const serviceUser = require("../../services/mongoDbService")({ model: User });
const serviceLike = require("../../services/mongoDbService")({ model: Like });
const message = require("../../utils/messages");
const responceCode = require("../../utils/responseCode");

exports.likeupdate = async (req,) => {
  try {
    let reqBody = req.body.uid;
    let reqUser = req.user;

    let like = await serviceLike.getSingleDocumentByQuery({ user: reqUser._id });
    if (like) {
      like = like.toJSON();
      let findindex = like.like.findIndex(ele => ele.toString() == reqBody);
      if (findindex != -1) {
        like.like.splice(findindex, 1);
        serviceLike.updateDocument(like._id, like);
      }
    }

    let findindex = reqUser.like.findIndex(ele => ele.toString() == reqBody);
    if (findindex != -1) {
      reqUser.like.splice(findindex, 1);
      serviceUser.findOneAndUpdateDocument({ _id: reqUser._id.toString() }, reqUser);
    }

    return message.successResponse(
      responceCode.success,
      {}
    );
  } catch (error) {
    console.log("error: ", error);
    return message.failureResponse(
      responceCode.internalServerError,
      "somthing went to wroung" + error
    );
  }
};

exports.disLikeupdate = async (req,) => {
  try {
    let reqBody = req.body.uid;

    let reqUser = req.user;

    let disLike = await serviceLike.getSingleDocumentByQuery({ user: reqUser._id });
    if (disLike) {
      disLike = disLike.toJSON();
      let findindex = disLike.disLike.findIndex(ele => ele.toString() == reqBody);
      if (findindex != -1) {
        disLike.disLike.splice(findindex, 1);
        serviceLike.updateDocument(disLike._id, disLike);
      }
    }

    let findindex = reqUser.disLike.findIndex(ele => ele.toString() == reqBody);
    if (findindex != -1) {
      reqUser.disLike.splice(findindex, 1);
      serviceUser.findOneAndUpdateDocument({ _id: reqUser._id.toString() }, reqUser);
    }

    return message.successResponse(
      responceCode.success,
      {}
    );
  } catch (error) {
    message.failureResponse(
      responceCode.internalServerError,
      "somthing went to wroung" + error
    );
  }
};


exports.superLikeupdate = async (req,) => {
  try {
    let { id } = req.params;

    let reqUser = req.user;

    let disLike = await serviceLike.getSingleDocumentByQuery({ user: reqUser._id });
    if (disLike) {
      disLike = disLike.toJSON();
      let findindex = disLike.superLike.findIndex(ele => ele.toString() == id);
      if (findindex != -1) {
        disLike.superLike.splice(findindex, 1);
        serviceLike.updateDocument(disLike._id, disLike);
      }
    }

    let findindex = reqUser.superLike.findIndex(ele => ele.toString() == id);
    if (findindex != -1) {
      reqUser.superLike.splice(findindex, 1);
      serviceUser.findOneAndUpdateDocument({ _id: reqUser._id.toString() }, reqUser);
    }

    return message.successResponse(
      responceCode.success,
      {}
    );
  } catch (error) {
    message.failureResponse(
      responceCode.internalServerError,
      "somthing went to wroung" + error
    );
  }
};