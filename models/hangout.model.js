const mongoose = require("mongoose")
const { User } = require("./user.model")

const hangoutSchema = mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    image: {
        type: String
    },
    details: {
        type: String
    },
    addLink: {
        type: String
    },
    selectDate: {
        type: String
    },
    selectTime: {
        type: String
    },
    date: {
        type: Number
    },
    selectLocation: {
        type: {
            type: String,
            default: "Point",
        },
        coordinates: Array,
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
    },
    address: {
        type: String
    },
    isCancel: {
        type: Boolean,
        default: false
    },
    titleCancel: {
        type: String
    },

}, { timestamps: true })

const Hangout = mongoose.model("Hangout", hangoutSchema)

exports.Hangout = Hangout