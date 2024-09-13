const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages")
const { specialDate } = require("../../models/specialDate.model")
const mongoDbServiceSpecialDate = require("../../services/mongoDbService")({ model: specialDate })

exports.getSpecialDate = async (req) => {
    try {
        let { id } = req.params
        let { pageNumber, pageSize, } = req.body
        let populate = [{ path: "opuserId", select: "_id fullName address profile  lifestyle birthDate  about profession gender email age" },
        { path: "userId", select: "_id fullName address profile  lifestyle birthDate  about profession gender email age" }]

        let getDate = await mongoDbServiceSpecialDate.getDocumentByQueryPopulate({ $or: [{ userId: req.user._id, opuserId: id }, { userId: id, opuserId: req.user._id }] }, [], populate, pageNumber, pageSize, { date: -1 })
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