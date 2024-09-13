const express = require("express")
const router = express.Router()
const date = require("../controller/subCategory")


router.post("/create", date.createcategory)

router.get("/find", date.getCategoryAll)

router.put("/update/:id", date.categoryUpdate)

router.delete("/delete/:id", date.categoryDelete
)

module.exports = router