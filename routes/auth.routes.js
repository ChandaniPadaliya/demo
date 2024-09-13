const express = require("express");
const router = express.Router();
const auth = require("../controller/auth");


router.post("/sign-in", auth.login);



module.exports = router;