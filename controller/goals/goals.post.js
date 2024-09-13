const { Goal } = require("../../models/goal.model");
const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages");
const { User } = require("../../models/user.model");
const mongoDbServiceGoals = require("../../services/mongoDbService")({ model: Goal })
const gcm = require("node-gcm");

const mongoDbServiceUser = require("../../services/mongoDbService")({ model: User })

exports.goalCreate = async (req) => {
    try {
        let { opuserId, date, title, description } = req.body
        let dateCaret = {
            opuserId,
            date,
            title,
            description,
            userId: req.user._id
        }
        await mongoDbServiceGoals.createDocument(dateCaret)




        let getUser = await mongoDbServiceUser.getSingleDocumentByQuery({ _id: opuserId, isNotification: true })
        if (getUser) {
            const messages = new gcm.Message({
                to: "device",
                notification: {
                    title: "Goal create",
                    body: "Goal",
                    "color": "#e50012",
                    priority: "high",
                    group: "GROUP",
                    sound: "default",
                    show_in_foreground: true,
                },
                data: {
                    id: "",
                    type: "",
                },
            });
            const send = new gcm.Sender(
                "AAAA7OtooCU:APA91bHtP6fDPvzXBVPaXWItn5p6MgjMxjNrpFpBfZmLimQhNd98SgrInmvsVxFS_vzOhXEju1InjDQikJfrrWPyxlElR8TdjejoIimNEiPL-fGszJ8RYaxxjxELkVnKLizkGa_mkP8q"
            );
            await send.send(
                messages,
                {
                    registrationTokens: [getUser.deviceToken]
                },
                function (err, res) {
                    console.log('res: ', res);
                    if (err) {
                        console.log("notication err     ios :>> ", err);
                    }

                }
            )
        }
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