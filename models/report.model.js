const mongoose = require("mongoose");
const { User } = require("./user.model");
const { Hangout } = require("./hangout.model");

const reportSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    title: {
        type: String
    },
    hangount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Hangout
    },
    type: {
        type: String
    }
}, { timestamps: true })

const Report = mongoose.model("Report", reportSchema)
exports.Report = Report