const express = require("express")
const router = express.Router()
const specialDate = require("../controller/specialDate")
const { auth } = require("../middleware/auth.mdl")

router.post("/create", auth, specialDate.create)

router.get("/get/:id", auth, specialDate.getAll)

router.put("/update/:id", specialDate.dateUpdate)

router.delete("/delete/:id", specialDate.Delete)

module.exports = router