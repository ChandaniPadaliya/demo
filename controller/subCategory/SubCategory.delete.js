const messages = require("../../utils/messages")
const cloudinary = require("../../config/cloudinary")
const responescode = require("../../utils/responseCode");
const { SubCategory } = require("../../models/subCategory.model");
const mongoDbserviceSubCategory = require("../../services/mongoDbService")({ model: SubCategory })

exports.deleteCategory = async (req) => {
    try {
        let { id } = req.params
        let data = await mongoDbserviceSubCategory.getDocumentById(id)
        if (data) {
            cloudinary.uploader.destroy(data.image, { resource_type: "image" });
        }
        if (!data) {
            return messages.badRequest(
                responescode.badRequest,
                "cannot find name for barber"
            )
        }
        let a = await mongoDbserviceSubCategory.deleteDocument(data._id)
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