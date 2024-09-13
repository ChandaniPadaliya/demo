const mongoose = require("mongoose")
const { User } = require("./user.model")

const dateSchema = new mongoose.Schema({
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

    },
    specialMoment: {
        type: String
    },
    description: {
        type: String
    }
}, { timestamps: true })

const Date = mongoose.model("Date", dateSchema)

exports.Date = Date