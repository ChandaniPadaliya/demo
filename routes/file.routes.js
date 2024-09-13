const express = require("express");
const multer = require("multer");
const router = express.Router();

const postFile = require("../controller/fileUpload");

const upload = multer()
  .array("file", 100);

router.post("/upload", upload, postFile.upload);

module.exports = router;