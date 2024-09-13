const mongoose = require("mongoose")

const userdelete = new mongoose.Schema({
    email: {
        type: String
    },
    reason: [{
        type: String
    }],
    description: {
        type: String
    },
    deleteTime: {
        type: Number
    },
    bugIssue: {
        type: String
    },
    issueNotSolved: {
        type: String
    },
    highPrice: {
        type: String
    },
    usingOtherApp: {
        type: String
    },
    inAppropriateContent: {
        type: String
    }
})
const userDelete = mongoose.model("userDelete", userdelete)
exports.userDelete = userDelete