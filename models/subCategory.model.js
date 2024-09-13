const mongoose = require("mongoose")
const { Category } = require("./category.model")

const subcategorySchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Category
    },
    name: {
        type: String
    }
})

const SubCategory = mongoose.model("SubCategory", subcategorySchema)

exports.SubCategory = SubCategory