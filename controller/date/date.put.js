const { Date } = require("../../models/date.model");
const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages")
const mongoDbServiceDate = require("../../services/mongoDbService")({ model: Date })


exports.dateUpdate = async (req) => {
  try {
    let { id } = req.params

    let { date, specialMoment, description } = req.body
    let getDate = await mongoDbServiceDate.getSingleDocumentById(id)
    if (!getDate) {
      return message.inValidParam(
        responceCode.validationError,
        "please enter valid id"
      );
    }
    getDate = getDate.toJSON()
    getDate.date = date ? date : getDate.date
    getDate.specialMoment = specialMoment ? specialMoment : getDate.specialMoment
    getDate.description = description ? description : getDate.description

    let a = await mongoDbServiceDate.findOneAndUpdateDocument({ _id: id }, getDate, { new: true })
    return message.successResponse(
      responceCode.success, {}
    )
  } catch (err) {
    console.log('err: ', err);
    return message.failureResponse(
      responceCode.internalServerError
    )
  }
}