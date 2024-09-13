const { Date } = require("../../models/date.model");
const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages")
const mongoDbServiceDate = require("../../services/mongoDbService")({ model: Date })

const { User } = require("../../models/user.model");
const serviceUser = require("../../services/mongoDbService")({ model: User });
const gcm = require("node-gcm");
exports.DateCreate = async (req) => {
  try {
    let { opuserId, date, specialMoment, description } = req.body
    let dateCaret = {
      opuserId,
      date,
      specialMoment,
      description,
      userId: req.user._id
    }
    await mongoDbServiceDate.createDocument(dateCaret)


    let getUser = await serviceUser.getSingleDocumentByQuery({ _id: opuserId, isNotification: true })
    if (getUser) {
      const messages = new gcm.Message({
        to: "device",
        notification: {
          title: "Save Date create",
          body: "Date",
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