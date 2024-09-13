const { Goal } = require("../../models/goal.model");
const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages")
const mongoDbServiceGoals = require("../../services/mongoDbService")({ model: Goal })

exports.deleteGoal = async (req) => {
    try {
        let { id } = req.params
        let getDate = await mongoDbServiceGoals.getSingleDocumentById(id)
        if (!getDate) {
            return message.inValidParam(
                responceCode.validationError,
                "please enter valid id"
            );
        }
        await mongoDbServiceGoals.deleteDocument(id)
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