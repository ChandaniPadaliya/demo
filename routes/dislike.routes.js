const express = require("express");
const router = express.Router();
const dislike = require("../controller/like");
const { auth } = require("../middleware/auth.mdl");


router.post("/add/:id", auth, dislike.dislikecreate);
router.get("/get", auth, dislike.get);
router.put("/remove", auth, dislike.disLikeupdate);


module.exports = router;