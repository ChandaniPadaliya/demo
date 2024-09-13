const messages = require("../../utils/messages")
const cloudinary = require("../../config/cloudinary")
const responescode = require("../../utils/responseCode");
const { Education } = require("../../models/education.model");
const mongoDbserviceEducation = require("../../services/mongoDbService")({ model: Education })

exports.deleteEducation = async (req) => {
    try {
        let { id } = req.params
        let data = await mongoDbserviceEducation.getDocumentById(id)
        if (!data) {
            return messages.badRequest(
                responescode.badRequest,
                "cannot find name for barber"
            )
        }
        let a = await mongoDbserviceEducation.deleteDocument(data._id)
        return messages.successResponse(
            responescode.success,
            "Data Successfull delete"
        )
    } catch (err) {
        console.log('err: ', err);
        return messages.failureResponse(
            responescode.internalServerError
        )
    }
}