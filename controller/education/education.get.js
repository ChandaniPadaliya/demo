const messages = require("../../utils/messages")
const responescode = require("../../utils/responseCode");
const { Education } = require("../../models/education.model");
const mongoDbserviceEducation = require("../../services/mongoDbService")({ model: Education })

exports.getEducation = async (req) => {
    try {
        let query = {}

        let data = await mongoDbserviceEducation.getDocumentByQuery(query)

        return messages.successResponse(
            responescode.success, data
        )
    } catch (err) {
        console.log('err: ', err);
        return messages.failureResponse(
            responescode.internalServerError
        )
    }
}

exports.getEducationyId = async (req) => {
    try {
        let { id } = req.params
        if (!id) {
            return messages.inValidParam(
                responescode.validationError
            );
        }
        let select = ["name"]
        let data = await mongoDbserviceEducation.getDocumentById(
            id,
            select
        )

        return messages.successResponse(
            responescode.success, data
        )
    } catch (err) {
        console.log('err: ', err);
        return messages.failureResponse(
            responescode.internalServerError
        )
    }
}

