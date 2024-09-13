const express = require("express");
const router = express.Router();
const like = require("../controller/like");
const { auth } = require("../middleware/auth.mdl");


router.post("/add/:id", auth, like.superlikeCreate);
router.put("/remove/:id", auth, like.superLikeupdate);



module.exports = router;