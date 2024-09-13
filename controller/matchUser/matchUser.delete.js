const { MatchUser } = require("../../models/matchUser.model")
const message = require("../../utils/messages")
const responceCode = require("../../utils/responseCode")
const mongoDbServiceMatchUser = require("../../services/mongoDbService")({ model: MatchUser })

exports.deletematch = async (req) => {
    try {
        let { id } = req.params
        let getMatch = await mongoDbServiceMatchUser.getSingleDocumentById(id)
        if (!getMatch) {
            return message.invalidRequest(
                responceCode.badRequest,
                "id is invalid"
            )
        }
        await mongoDbServiceMatchUser.deleteDocument(id)
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