const mongoose = require("mongoose")
const { User } = require("./user.model")

const matchuserSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    matchScore: {
        type: Number
    }
}, { timestamps: true })

const MatchUser = mongoose.model("MatchUser", matchuserSchema)

exports.MatchUser = MatchUser