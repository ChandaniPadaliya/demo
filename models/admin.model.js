const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

const adminSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    otp: {
        type: Number
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

adminSchema.methods.generateAdminToken = function () {
    return jwt.sign({ _id: this._id }, process.env.jwrPrivatKey)
}

const Admin = mongoose.model("Admin", adminSchema)

exports.Admin = Admin