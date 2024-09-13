const express = require("express")
const router = express.Router()
const hangout = require("../controller/hangout")
const { auth } = require("../middleware/auth.mdl")


router.post("/create", auth, hangout.create)

router.get("/find", auth, hangout.gethangout)

router.get("/get-one/:id", auth, hangout.getHangoutOne)

router.get("/get-user", auth, hangout.getHangoutUser)

router.put("/update/:id", hangout.hangoutUpdate)

router.put("/join-req/:id", auth, hangout.joinrequest)

router.put("/join/:id", hangout.joinEvent)

router.put("/reject/:id", hangout.reject)

router.put("/cancel/:id", hangout.cancel)

router.delete("/delete", hangout.deletehangout)

router.get("/notification-get", auth, hangout.getNotification)

router.put("/remove", auth, hangout.remove)

module.exports = router