const { Education } = require("../../models/education.model");
const messages = require("../../utils/messages")
const responescode = require("../../utils/responseCode")
const mongoDbserviceEducation = require("../../services/mongoDbService")({ model: Education })

exports.educationCreate = async (req) => {
    try {

        let { name } = req.body
        let findEducation = await mongoDbserviceEducation.getSingleDocumentByQuery({ name })
        if (findEducation) {
            return messages.isAssociated(
                responescode.found,
            );
        }
        if (!name) {
            return messages.invalidRequest(
                responescode.badRequest,
                "name is require"
            )
        }
        let education = {
            name
        }

        let createEducation = await mongoDbserviceEducation.createDocument(education)
        return messages.successResponse(
            responescode.success, createEducation
        )
    } catch (err) {
        console.log('err: ', err);
        return messages.failureResponse(
            responescode.internalServerError
        )
    }
}      