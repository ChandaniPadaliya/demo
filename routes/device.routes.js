const express = require("express");
const router = express.Router();
const deviceGet = require("../controller/device/register.get");
const registerCreate = require("../controller/device/register.post");
const registerUpdate = require("../controller/device/register.patch");
const send = require("../controller/device/send");

// send Notification
router.post("/send", send.findAll);

// Retrive Device
router.get("/", deviceGet.findAll);

// Retrive One Device
router.get("/:id", deviceGet.findOne);

// Register new Device
router.post("/", registerCreate.create);

// Device update
router.patch("/:id", registerUpdate.update);

module.exports = router;