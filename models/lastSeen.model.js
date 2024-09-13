const mongoose = require("mongoose")
const { User } = require("./user.model")
const { ChatRoom } = require("./chat/room.model")

const lastseenSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    user1Time: {
        type: Number
    },
    user2Time: {
        type: Number
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ChatRoom
    }
}, { timestamps: true })

const lastSeen = mongoose.model("lastSeen", lastseenSchema)

exports.lastSeen = lastSeen