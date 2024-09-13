const mongoose = require("mongoose")

const feedbackuserSchema = new mongoose.Schema({
    email: {
        type: String
    },
    feedback: [{
        type: String
    }]
}, { timestamps: true })

const FeedbackUser = mongoose.model("FeedbackUser", feedbackuserSchema)

exports.FeedbackUser = FeedbackUser
