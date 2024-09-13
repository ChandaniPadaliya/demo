const express = require("express");
const router = express.Router();
const like = require("../controller/like");
const { auth } = require("../middleware/auth.mdl");


router.post("/add/:id", auth, like.create);
router.get("/get", auth, like.get);
router.get("/opp/:id", like.getByAdmin)
router.put("/remove", auth, like.update);

module.exports = router;