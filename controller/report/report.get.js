const { Report } = require("../../models/report.model")
const message = require("../../utils/messages")
const responceCode = require("../../utils/responseCode")
const mongoDbServiceReport = require("../../services/mongoDbService")({ model: Report })

exports.ReportGet = async (req) => {
    try {
        let getreport = await mongoDbServiceReport.getDocumentByQueryPopulate({}, [])
        return message.successResponse(
            responceCode.success, getreport)

    } catch (err) {
        console.log('err: ', err);
        return message.failureResponse(
            responceCode.internalServerError
        )
    }
}