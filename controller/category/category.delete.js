const { Category } = require("../../models/category.model");
const messages = require("../../utils/messages")
const cloudinary = require("../../config/cloudinary")
const responescode = require("../../utils/responseCode")
const mongoDbserviceCategory = require("../../services/mongoDbService")({ model: Category })

exports.deleteCategory = async (req) => {
    try {
        let { id } = req.params
        let data = await mongoDbserviceCategory.getDocumentById(id)

        if (!data) {
            return messages.badRequest(
                responescode.badRequest,
                "cannot find name for barber"
            )
        }
        let a = await mongoDbserviceCategory.deleteDocument(data._id)
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