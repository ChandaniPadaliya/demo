const { Category } = require("../../models/category.model");
const messages = require("../../utils/messages")
const responescode = require("../../utils/responseCode")
const mongoDbserviceSubCategory = require("../../services/mongoDbService")({ model: Category })

exports.categoryUpdate = async (req) => {
  try {
    let { id } = req.params
    let { name, categoryId } = req.body

    let findCategory = await mongoDbserviceSubCategory.getSingleDocumentById(id)
    if (!findCategory) {
      return messages.inValidParam(
        responescode.notFound
      );
    }

    findCategory = findCategory.toJSON()
    findCategory.name = name ? name : findCategory.name
    findCategory.categoryId = categoryId ? categoryId : findCategory.categoryId
    let update = await mongoDbserviceSubCategory.findOneAndUpdateDocument({ _id: findCategory._id }, findCategory, { new: true })

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