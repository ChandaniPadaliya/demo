const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages")
const { Hangout } = require("../../models/hangout.model")
const mongoDbServiceHangout = require("../../services/mongoDbService")({ model: Hangout })

exports.deleteHangout = async (req) => {
    try {
        let { id, titleCancel } = req.query
        let getHangout = await mongoDbServiceHangout.getSingleDocumentById(id)
        if (!getHangout) {
            return message.inValidParam(
                responceCode.validationError,
                "please enter valid id"
            );
        }
        getHangout = getHangout.toJSON()
        getHangout.isCancel = true
        getHangout.titleCancel = titleCancel
        await mongoDbServiceHangout.findOneAndUpdateDocument({ _id: id }, getHangout, { new: true })
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