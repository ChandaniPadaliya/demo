const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages")
const { Report } = require("../../models/report.model")
const mongoDbServiceReport = require("../../services/mongoDbService")({ model: Report })

exports.reportCreate = async (req) => {
    try {
        let { hangount, title, user1, } = req.body
        let create
        if (hangount) {
            create = {
                user: req.user._id,
                title,
                hangount,
                type: "hangout"
            }
        } else create = {
            user: req.user._id,
            title,
            user1,
            type: "user"
        }
        await mongoDbServiceReport.createDocument(create)
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