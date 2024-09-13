const { User } = require("../../models/user.model");
const serviceUser = require("../../services/mongoDbService")({ model: User });
const message = require("../../utils/messages");
const responceCode = require("../../utils/responseCode");


exports.cron = async () => {
    try {
        let date = new Date().getTime()
        let a = new Date(date)
        let query = { $and: [{ snooze: { $ne: 1 } }, { snooze: { $ne: 0 } }] }
        let userGet = await serviceUser.getDocumentByQuery(query)
        for (const ele of userGet) {
            if (ele.snooze <= date) {
                await serviceUser.findOneAndUpdateDocument({ _id: ele._id }, { snooze: 1 }, { new: true })
            }
        }
    } catch (err) {
        console.log("err: ", err);
        return message.failureResponse(
            responceCode.internalServerError
        );
    }
}