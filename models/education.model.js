const mongoose = require("mongoose")

const educationySchema = new mongoose.Schema({
    name: {
        type: String
    }
}, { timestamps: true })

const Education = mongoose.model("Education", educationySchema)

exports.Education = Education
