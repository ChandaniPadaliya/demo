const { Chat } = require("../../models/chat/chat.model");
const { ChatRoom } = require("../../models/chat/room.model");
const mongoDbserviceChatRoom = require("../../services/mongoDbService")({ model: ChatRoom })
const mongoDbserviceChat = require("../../services/mongoDbService")({ model: Chat })

exports.cron = async () => {
    let getRoom = await mongoDbserviceChatRoom.getDocumentByQuery({ isNot: false })

    for (const ele of getRoom) {
        let chatdata = await mongoDbserviceChat.getDocumentByQuery({ roomId: ele._id, isRead: false })
        for (const ee of chatdata) {
            await mongoDbserviceChat.findOneAndUpdateDocument({ _id: ee._id }, { isRead: true }, { new: true })
        }
    }
}