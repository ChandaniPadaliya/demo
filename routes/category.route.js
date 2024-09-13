const express = require("express")
const router = express.Router()
const category = require("../controller/category")


router.post("/create", category.createcategory)

router.get("/find", category.getCategoryAll)


router.put("/update/:id", category.categoryUpdate)

router.delete("/delete/:id", category.categoryDelete)

module.exports = router