
const express = require("express")
const router = express.Router()
const group = require("../controller/group")
const { auth } = require("../middleware/auth.mdl")


router.post("/create", auth, group.create)

router.get("/get", group.getgroup)

router.get("/get-one/:id", auth, group.getGroupOne)

router.post("/join/:id", auth, group.joinrequest)

router.put("/update/:id", auth, group.groupUpdate)

router.delete("/delete/:id", auth, group.deleteGroup)


module.exports = router