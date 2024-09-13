const { SubCategory } = require("../../models/subCategory.model");
const messages = require("../../utils/messages")
const responescode = require("../../utils/responseCode")
const mongoDbserviceSubCategory = require("../../services/mongoDbService")({ model: SubCategory })

exports.getcategory = async (req) => {
    try {
        let query = {}

        let data = await mongoDbserviceSubCategory.getDocumentByQuery(query)

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


exports.getcategoryyId = async (req) => {
    try {
        let { id } = req.params
        if (!id) {
            return messages.inValidParam(
                responescode.validationError
            );
        }
        let select = ["name", "image", "categoryFor"]
        let data = await mongoDbserviceSubCategory.getDocumentById(
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

exports.getcategoryyIdAdmin = async (req) => {
    try {
        let { categoryId } = req.body
        if (!id) {
            return messages.inValidParam(
                responescode.validationError
            );
        }
        let select = ["name", "image"]
        let data = await mongoDbserviceSubCategory.getDocumentByQuery(
            { _id: categoryId },
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