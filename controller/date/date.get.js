const { Date } = require("../../models/date.model");
const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages")
const mongoDbServiceDate = require("../../services/mongoDbService")({ model: Date })

exports.getDate = async (req) => {
  try {
    let { id } = req.params
    let { pageNumber, pageSize, } = req.body
    let populate = [{ path: "opuserId", select: "_id fullName address profile  lifestyle birthDate  about profession gender email age" },
    { path: "userId", select: "_id fullName address profile  lifestyle birthDate  about profession gender email age" }]
    let getDate = await mongoDbServiceDate.getDocumentByQueryPopulate(
      { $or: [{ userId: req.user._id, opuserId: id }, { userId: id, opuserId: req.user._id }] },
      [],
      populate,
      pageNumber,
      pageSize,
      { date: -1 }
    )
    return message.successResponse(
      responceCode.success, getDate
    )
  } catch (err) {
    console.log('err: ', err);
    return message.failureResponse(
      responceCode.internalServerError
    )
  }
}

