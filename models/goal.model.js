const mongoose = require("mongoose")
const { User } = require("./user.model")

const goalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    opuserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    date: {
        type: Number,
        default: new Date().getTime()
    },
    title: {
        type: String
    },
    description: {
        type: String
    }
}, { timestamps: true })

const Goal = mongoose.model("Goal", goalSchema)

exports.Goal = Goal