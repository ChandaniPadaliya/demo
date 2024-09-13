const express = require("express")
const router = express.Router()
const date = require("../controller/date")
const { auth } = require("../middleware/auth.mdl")


router.post("/create", auth, date.create)

router.get("/find/:id", auth, date.getAll)

router.put("/update/:id", date.dateUpdate)

router.delete("/delete/:id", date.deleteDate)

module.exports = router