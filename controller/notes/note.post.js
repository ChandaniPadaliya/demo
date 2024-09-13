const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages");
const { Note } = require("../../models/note.model");
const mongoDbServiceNote = require("../../services/mongoDbService")({ model: Note })
const { User } = require("../../models/user.model");
const serviceUser = require("../../services/mongoDbService")({ model: User });
const gcm = require("node-gcm");

exports.noteCreate = async (req) => {
    try {
        let { opuserId, title, description } = req.body
        let noteCaret = {
            userId: req.user._id,
            opuserId,
            title,
            description
        }
        await mongoDbServiceNote.createDocument(noteCaret)

        let getUser = await serviceUser.getSingleDocumentByQuery({ _id: opuserId, isNotification: true })
        const messages = new gcm.Message({

            to: "device",
            notification: {
                title: "Notes create",
                body: "Notes",
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