const mongoose = require("mongoose")

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String
    }
}, { timestamps: true })

const Feedback = mongoose.model("Feedback", feedbackSchema)

exports.Feedback = Feedback

