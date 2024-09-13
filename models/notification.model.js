const mongoose = require("mongoose")
const { User } = require("./user.model")
const { Hangout } = require("./hangout.model")
const notifictionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    hangout: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Hangout
    },
    type: {
        type: String
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Notification = mongoose.model("Notification", notifictionSchema)
exports.Notification = Notification