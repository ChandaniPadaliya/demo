const { Goal } = require("../../models/goal.model");
const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages")
const mongoDbServiceGoals = require("../../services/mongoDbService")({ model: Goal })


exports.goalUpdate = async (req) => {
    try {
        let { id } = req.params
        let { date, title, description } = req.body
        let getDate = await mongoDbServiceGoals.getSingleDocumentById(id)
        if (!getDate) {
            return message.inValidParam(
                responceCode.validationError,
                "please enter valid id"
            );
        }
        getDate = getDate.toJSON()
        getDate.date = date ? date : getDate.date
        getDate.title = title ? title : getDate.title
        getDate.description = description ? description : getDate.description

        await mongoDbServiceGoals.findOneAndUpdateDocument({ _id: id }, getDate, { new: true })
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