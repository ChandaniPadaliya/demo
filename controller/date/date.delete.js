const { Date } = require("../../models/date.model");
const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages")
const mongoDbServiceDate = require("../../services/mongoDbService")({ model: Date })


exports.deleteDate = async (req) => {
    try {
        let { id } = req.params
        let getDate = await mongoDbServiceDate.getSingleDocumentById(id)
        if (!getDate) {
            return message.inValidParam(
                responceCode.validationError,
                "please enter valid id"
            );
        }
        await mongoDbServiceDate.deleteDocument(id)
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