const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    name: {
        type: String
    }
}, { timestamps: true })

const Category = mongoose.model("Category", categorySchema)

exports.Category = Category
