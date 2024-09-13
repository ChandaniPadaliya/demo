const express = require("express")
const router = express.Router()
const education = require("../controller/education")


router.post("/create", education.createeducation)

router.get("/find", education.geteducationAll)


router.put("/update/:id", education.educationUpdate)

router.delete("/delete/:id", education.educationDelete)

module.exports = router