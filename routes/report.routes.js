const express = require("express")
const router = express.Router()
const report = require("../controller/report")
const { auth } = require("../middleware/auth.mdl")


router.post("/create", auth, report.create)

router.get("/find", auth, report.getreport)

router.delete("/delete/:id", report.deletereport)

module.exports = router