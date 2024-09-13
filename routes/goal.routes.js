const express = require("express")
const router = express.Router()
const goals = require("../controller/goals")
const { auth } = require("../middleware/auth.mdl")


router.post("/create", auth, goals.create)

router.get("/find/:id", auth, goals.getAll)

router.put("/update/:id", goals.goalUpdate)

router.delete("/delete/:id", goals.deletegoal)

module.exports = router