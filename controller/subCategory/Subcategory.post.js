const { SubCategory } = require("../../models/subCategory.model");
const messages = require("../../utils/messages")
const responescode = require("../../utils/responseCode")
const mongoDbserviceSubCategory = require("../../services/mongoDbService")({ model: SubCategory })

exports.categoryCreate = async (req) => {
    try {

        let { name, categoryId } = req.body
        let findCategory = await mongoDbserviceSubCategory.getSingleDocumentByQuery({ name })
        if (findCategory) {
            return messages.isAssociated(
                responescode.found,
            );
        }
        if (!name) {
            return messages.invalidRequest(
                responescode.badRequest,
                "name enter require"
            )
        }
        let category = {
            name,
            category: categoryId
        }

        let createCategory = await mongoDbserviceSubCategory.createDocument(category)
        return messages.successResponse(
            responescode.success, createCategory
        )
    } catch (err) {
        console.log('err: ', err);
        return messages.failureResponse(
            responescode.internalServerError
        )
    }
}