const express = require("express");
const router = express.Router();
const cronJob = require("node-cron");
const userCron = require("../controller/user/userCron");
const user = require("../controller/user");
const { auth } = require("../middleware/auth.mdl");
cronJob.schedule(" */5 * * * * *  ", () => {
    userCron.cron();
})

router.post("/register", user.create);

router.post("/payment", user.payment)

router.get("/find", auth, user.getAll);

router.get("/get-all", user.getAllbyAdmin);

router.get("/find-one/:id", auth, user.getOne);

router.put("/update/:id", user.updateUser);

router.delete("/delete/:id", user.deleteUser);

router.post("/join/:id", auth, user.joinNotification)

router.post("/block/:id", auth, user.block)

router.post("/unblock/:id", auth, user.unblock)

router.post("/install", user.userInstall)

router.get("/get-delete", user.getDeleteUser)

router.post("/feedback-create", user.FeedbackCreate)

router.post("/feedback", user.FeedbackUserCreate)

router.get("/feedback-get", user.getFeedback)

router.post("/survey-create", user.SurveyCreate)

router.post("/survey", user.SurveyUserCreate)

router.get("/survey-get", user.getSurvey)



module.exports = router;