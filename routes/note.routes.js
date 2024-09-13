const express = require("express")
const router = express.Router()
const note = require("../controller/notes")
const { auth } = require("../middleware/auth.mdl")


router.post("/create", auth, note.create)

router.get("/find/:id", auth, note.getAll)

router.put("/update/:id", note.noteUpdate)

router.delete("/delete/:id", note.noteDelete)

module.exports = router