const mongoose = require("mongoose")
const { User } = require("./user.model")

const noteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    opuserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    title: {
        type: String
    },
    description: {
        type: String
    }
}, { timestamps: true })

const Note = mongoose.model("Note", noteSchema)

exports.Note = Note