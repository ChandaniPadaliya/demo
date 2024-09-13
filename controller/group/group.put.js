const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages")
const { Group } = require("../../models/group.model")
const { ChatRoom } = require("../../models/chat/room.model")
const mongoDbServiceGroup = require("../../services/mongoDbService")({ model: Group })
const mongoDbserviceChatRoom = require("../../services/mongoDbService")({ model: ChatRoom })

exports.groupUpdate = async (req) => {
    try {
        let { id } = req.params
        let { image, groupName, description, } = req.body

        let getHangout = await mongoDbServiceGroup.getSingleDocumentByQuery({ id: id, admin: req.user._id })


        if (!getHangout) {
            return message.inValidParam(
                responceCode.validationError,
                "please enter valid id"
            );
        }
        let roomGet = await mongoDbserviceChatRoom.getSingleDocumentByQuery({ groupId: id })
        if (roomGet) {
            roomGet = roomGet.toJSON()
            roomGet.image = image ? image : roomGet.image
            roomGet.groupName = groupName ? groupName : roomGet.groupName
            roomGet.description = description ? description : roomGet.description

            await mongoDbserviceChatRoom.findOneAndUpdateDocument({ _id: roomGet._id }, roomGet, { new: true })

        }
        getHangout = getHangout.toJSON()
        getHangout.image = image ? image : getHangout.image
        getHangout.groupName = groupName ? groupName : getHangout.groupName
        getHangout.description = description ? description : getHangout.description



        await mongoDbServiceGroup.findOneAndUpdateDocument({ _id: id }, getHangout, { new: true })
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