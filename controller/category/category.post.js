const { Category } = require("../../models/category.model");
const messages = require("../../utils/messages")
const responescode = require("../../utils/responseCode")
const mongoDbserviceCategory = require("../../services/mongoDbService")({ model: Category })

exports.categoryCreate = async (req) => {
    try {

        let { name } = req.body
        let findCategory = await mongoDbserviceCategory.getSingleDocumentByQuery({ name })
        if (findCategory) {
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
        let category = {
            name
        }

        let createCategory = await mongoDbserviceCategory.createDocument(category)
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