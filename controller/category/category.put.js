const { Category } = require("../../models/category.model");
const messages = require("../../utils/messages")
const responescode = require("../../utils/responseCode")
const mongoDbserviceCategory = require("../../services/mongoDbService")({ model: Category })

exports.categoryUpdate = async (req) => {
    try {
        let { id } = req.params
        let { name } = req.body

        let findCategory = await mongoDbserviceCategory.getSingleDocumentById(id)
        if (!findCategory) {
            return messages.inValidParam(
                responescode.notFound
            );
        }

        findCategory = findCategory.toJSON()
        findCategory.name = name ? name : findCategory.name
        let update = await mongoDbserviceCategory.findOneAndUpdateDocument({ _id: findCategory._id }, findCategory, { new: true })

        update = update.toJSON()
        delete update.__v
        return messages.successResponse(
            responescode.success, update
        )

    } catch (err) {
        console.log('err: ', err);
        return messages.failureResponse(
            responescode.internalServerError
        )
    }

}