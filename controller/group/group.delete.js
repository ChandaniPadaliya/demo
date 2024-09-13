
const messages = require("../../utils/messages")
const cloudinary = require("../../config/cloudinary")
const responescode = require("../../utils/responseCode")
const { Group } = require("../../models/group.model")
const { ChatRoom } = require("../../models/chat/room.model")
const mongoDbServiceGroup = require("../../services/mongoDbService")({ model: Group })
const mongoDbserviceChatRoom = require("../../services/mongoDbService")({ model: ChatRoom })


exports.deleteGroup = async (req) => {
    try {
        let { id } = req.params
        let data = await mongoDbServiceGroup.getSingleDocumentByQuery({ _id: id, admin: req.user._id })

        if (!data) {
            return messages.badRequest(
                responescode.badRequest,
                "cannot find name for barber"
            )
        }
        await mongoDbServiceGroup.findOneAndDeleteDocument({ _id: data._id })
        await mongoDbserviceChatRoom.findOneAndDeleteDocument({ type: "group", groupId: data._id }, { new: true })
        return messages.successResponse(
            responescode.success,
            "Data Successfull delete"
        )
    } catch (err) {
        console.log('err: ', err);
        return messages.failureResponse(
            responescode.internalServerError
        )
    }
}