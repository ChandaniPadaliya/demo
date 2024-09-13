const mongoose = require("mongoose")
const { User } = require("./user.model")
// const { ChatRoom } = require("./chat/room.model")

const groupSchema = mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    image: {
        type: String
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatRoom",
    },
    groupName: {
        type: String
    },
    description: {
        type: String
    },
    member: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
    }],
    isPublic: {
        type: Boolean
    },
    eventLink: {
        type: String
    }
}, { timestamps: true })

const Group = mongoose.model("Group", groupSchema)

exports.Group = Group