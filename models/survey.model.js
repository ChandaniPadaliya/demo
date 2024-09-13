const mongoose = require("mongoose")

const surveySchema = new mongoose.Schema({
    title: {
        type: String
    },
    options: [{
        type: String
    }]
}, { timestamps: true })

const Survey = mongoose.model("Survey", surveySchema)

exports.Survey = Survey



const surveyUserSchema = new mongoose.Schema({
    title: [{
        title: String,
    }],
    options: [{
        options: String,
    }],
    email: {
        type: String
    }
}, { timestamps: true })

const SurveyUser = mongoose.model("SurveyUser", surveyUserSchema)

exports.SurveyUser = SurveyUser
