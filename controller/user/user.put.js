const { User } = require("../../models/user.model");
const serviceUser = require("../../services/mongoDbService")({ model: User });
const message = require("../../utils/messages");
const responceCode = require("../../utils/responseCode");

exports.update = async (req) => {
  try {
    let { id } = req.params
    let reqBody = req.body;

    let getUser = await serviceUser.getSingleDocumentById(id);
    if (!getUser) {
      return message.recordNotFound(
        responceCode.notFound,
      );
    }

    if (reqBody.birthDate) {
      let birtDate = new Date(reqBody.birthDate);
      let newDate = new Date();
      var diff = newDate.getTime() - birtDate.getTime();
      reqBody["age"] = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }

    if (reqBody.long && reqBody.lat) {
      reqBody["location"] = {
        type: "Point",
        coordinates: [reqBody.long, reqBody.lat]
      };
    }

    delete reqBody["email"];
    let user = await serviceUser.updateDocument(
      getUser._id.toString(),
      reqBody
    );
    user = await serviceUser.getSingleDocumentById(
      getUser._id.toString(),
    );


    return message.successResponse(
      responceCode.success,
      user
    );

  } catch (error) {
    console.log("error: ", error);
    return message.failureResponse(
      responceCode.internalServerError,
      error
    );
  }
};