const express = require("express")
const router = express.Router()
const matchUser = require("../controller/matchUser")
const { auth } = require("../middleware/auth.mdl")

router.post("/create/:id", auth, matchUser.create)

router.get("/get", matchUser.getmatch)

router.get("/get-one", auth, matchUser.getmatchOne)

router.delete("/delete/:id", matchUser.deleteMatch)

module.exports = router                                                                                                                     