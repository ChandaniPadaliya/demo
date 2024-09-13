const mongoose = require("mongoose");

const Schema = mongoose.Schema({
    token: {
        type: String
    },
    devicetype: {
        type: String
    },
    date: {
        type: String
    },
    deviceId: {
        type: String
    },
    fromPromoCode: {
        type: Boolean
    },
    count: {
        type: Number,
        default: 0
    },
}, { timestamps: true })

const appInstall = mongoose.model("appInstall", appInstallSchema)
exports.appInstall = appInstall