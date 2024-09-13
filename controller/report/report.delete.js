const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages")
const { Report } = require("../../models/report.model")
const mongoDbServiceReport = require("../../services/mongoDbService")({ model: Report })

exports.deleteReport = async (req) => {
    try {
        let { id } = req.params
        let getreport = await mongoDbServiceReport.getSingleDocumentById(id)
        if (!getreport) {
            return message.inValidParam(
                responceCode.validationError,
                "please enter valid id"
            );
        }
        await mongoDbServiceReport.deleteDocument(id)
        return message.successResponse(
            responceCode.success, {}
        )
    } catch (err) {
        console.log('err: ', err);
        return message.failureResponse(
            responceCode.internalServerError
        )
    }
}