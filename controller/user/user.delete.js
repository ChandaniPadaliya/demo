// const { likeDislike } = require("../../models/like.model");
const { User } = require("../../models/user.model");
const { userDelete } = require("../../models/userDelete.model");
const serviceUser = require("../../services/mongoDbService")({ model: User });
// const serviceLikeDislike = require("../../services/mongoDbService")({ model: likeDislike });
const message = require("../../utils/messages");
const responceCode = require("../../utils/responseCode");
const mongoDbserviceUserDelete = require("../../services/mongoDbService")({ model: userDelete })


exports.delete = async (req) => {
  try {
    let { id } = req.params
    let reqBody = req.body
    let a = await serviceUser.getSingleDocumentById(id)
    let create = {
      email: a.email,
      reason: reqBody.reason || [],
      description: reqBody.description || "",
      deleteTime: new Date().getTime(),
      bugIssue: reqBody.bugIssue || "",
      issueNotSolved: reqBody.issueNotSolved || "",
      highPrice: reqBody.highPrice || "",
      inAppropriateContent: reqBody.inAppropriateContent || "",
      usingOtherApp: reqBody.usingOtherApp || "",
    }
    await mongoDbserviceUserDelete.createDocument(create)
    await serviceUser.findOneAndUpdateDocument({ _id: id }, { isDeleted: true });


    return message.successResponse(
      responceCode.success,
      {}
    );
  } catch (error) {
    console.log("error: ", error);
    return message.failureResponse(
      responceCode.internalServerError,
      error
    );
  }
};