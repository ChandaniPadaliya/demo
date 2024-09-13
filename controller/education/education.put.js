const { Education } = require("../../models/education.model");
const messages = require("../../utils/messages")
const responescode = require("../../utils/responseCode")
const mongoDbserviceEducation = require("../../services/mongoDbService")({ model: Education })

exports.EducationUpdate = async (req) => {
    try {
        let { id } = req.params
        let { name } = req.body

        let findEducation = await mongoDbserviceEducation.getSingleDocumentById(id)
        if (!findEducation) {
            return messages.inValidParam(
                responescode.notFound
            );
        }

        findEducation = findEducation.toJSON()
        findEducation.name = name ? name : findEducation.name
        let update = await mongoDbserviceEducation.findOneAndUpdateDocument({ _id: findEducation._id }, findEducation, { new: true })

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