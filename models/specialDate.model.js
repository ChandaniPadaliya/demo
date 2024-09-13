const mongoose = require("mongoose")
const { User } = require("./user.model")

const specialdateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    opuserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    dateTitle: {
        type: String,
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
    location: {
        type: {
            type: String,
            default: "Point",
        },
        coordinates: Array,
    },
    address: {
        type: String
    },
    description: {
        type: String
    }
}, { timestamps: true })

const specialDate = mongoose.model("specialDate", specialdateSchema)

exports.specialDate = specialDate