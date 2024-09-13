const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages")
const { specialDate } = require("../../models/specialDate.model")
const mongoDbServiceSpecialDate = require("../../services/mongoDbService")({ model: specialDate })

exports.SpecialDateDelete = async (req) => {
    try {
        let { id } = req.params
        let getDate = await mongoDbServiceSpecialDate.getSingleDocumentById(id)
        if (!getDate) {
            return message.inValidParam(
                responceCode.validationError,
                "please enter valid id"
            );
        }
        await mongoDbServiceSpecialDate.deleteDocument(id)
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