const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages")
const { User } = require("../../models/user.model")
const { Notification } = require("../../models/notification.model")
const { Group } = require("../../models/group.model")
const { ChatRoom } = require("../../models/chat/room.model")
const mongoDbServiceGroup = require("../../services/mongoDbService")({ model: Group })
const mongoDbServiceUser = require("../../services/mongoDbService")({ model: User })
const mongoDbServiceNotification = require("../../services/mongoDbService")({ model: Notification })
const mongoDbserviceChatRoom = require("../../services/mongoDbService")({ model: ChatRoom })

exports.groupcreate = async (req) => {
    try {
        let { image, groupName, description, isPublic, eventLink } = req.body
        let create = {
            image,
            groupName,
            description,
            isPublic,
            eventLink,
            admin: req.user._id
        }
        let data = await mongoDbServiceGroup.createDocument(create)
        return message.successResponse(
            responceCode.success, data
        )
    } catch (err) {
        console.log('err: ', err);
        return message.failureResponse(
            responceCode.internalServerError
        )
    }
}

exports.joinEvent = async (req) => {
    try {
        let { id } = req.params
        let isJoin, add, remove = []
        let getEvent = await mongoDbServiceGroup.getSingleDocumentById(id)
        if (!getEvent) {
            return message.invalidRequest(
                responceCode.validationError,
                "invalid group id"
            )
        }

        let userget = await mongoDbServiceGroup.getSingleDocumentById(id)

        isJoin = userget.member
        let roomGet = await mongoDbserviceChatRoom.getSingleDocumentByQuery({ groupId: id })
        add = roomGet.opuser

        if ((isJoin.includes(req.user._id.toString())) && (add.includes(req.user._id.toString()))) {
            return message.successResponse(
                responceCode.success, { ...getEvent._doc, roomId: roomGet._id }
            )
        } else {
            isJoin.push(req.user._id)
            userget = userget.toJSON()
            userget.member = isJoin


            add.push(req.user._id)
            roomGet = roomGet.toJSON()
            roomGet.opuser = add

            await mongoDbserviceChatRoom.findOneAndUpdateDocument({ _id: roomGet._id }, roomGet, { new: true })
            let updateEvent = await mongoDbServiceGroup.findOneAndUpdateDocument({ _id: userget._id }, userget, { new: true })

            let roomGet1 = await mongoDbserviceChatRoom.getSingleDocumentByQuery({ groupId: id })
            remove = roomGet1.removeUser

            if (remove.includes(req.user._id)) {
                const idfind = (ele) => ele == req.user._id

                let index = remove.findIndex(idfind)
                remove.splice(index, 1)
                await mongoDbserviceChatRoom.findOneAndUpdateDocument({ _id: roomGet1._id }, roomGet1, { new: true })
            }
            return message.successResponse(
                responceCode.success, updateEvent
            )
        }
    } catch (err) {
        console.log('err: ', err);
        return message.failureResponse(
            responceCode.internalServerError
        )
    }
}