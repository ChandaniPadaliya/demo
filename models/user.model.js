const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { SubCategory } = require("./subCategory.model")
const { Education } = require("./education.model")
const userSchema = mongoose.Schema({
    fullName: {
        type: String,
    },
    location: {
        type: {
            type: String,
            default: "Point",
        },
        coordinates: Array,
    },
    address: {
        type: String,
        default: ""
    },
    birthDate: {
        type: String,
    },
    about: {
        type: String,
    },
    profile: {
        type: String,
    },
    lifestyle: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: SubCategory
    }],
    education: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Education
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Others"]
    },
    phone: {
        type: Number,
    },
    // university: {
    //     type: String
    // },
    countryCode: {
        type: String
    },
    photos: {
        type: Array,
        default: []
    },
    email: {
        type: String,
    },
    like: [
        type = String
    ],
    disLike: [
        type = String
    ],
    superLike: [],
    yourLike: [],
    age: {
        type: Number,
    },
    block: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    loginType: {
        type: String,
        // enum: ["Apple", "Google", "  "]
    },
    deviceToken: {
        type: String
    },
    platform: String,
    isNotification: {
        type: Boolean,
        default: true
    },
    deviceId: {
        type: String
    },
    PremiumType: {
        type: String,
        enum: ["Monthly", "Yearly", "Basic"]
    },
    Status: {
        type: String,
        enum: ["Basic", "Premium"]
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    instagramUserName: {
        type: String
    },
    zipcode: {
        type: String
    },
    dateMode: {
        type: Boolean,
        default: false
    },
    findForDate: {
        type: String,
        enum: ["Male", "Female", "Others"]
    },
    chooseDate: {
        type: String,

    },
    isUserGenerated: {
        type: Boolean,
        default: false
    },
    isSurvey: {
        type: Boolean,
        default: false
    },
    snooze: {
        type: Number,
        default: 1
    }
}, { timestamps: true });


userSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id, gender: this.gender }, process.env.jwrPrivatKey);
};


const User = mongoose.model("User", userSchema);
// const Admin = mongoose.model("Admin", userSchema);

exports.userSchema = userSchema;
exports.User = User;