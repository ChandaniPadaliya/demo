const express = require("express");
const router = express.Router();

const user = require("./user.routes");
const file = require("./file.routes");
const auth = require("./auth.routes");
const like = require("./like.routes");
const dislike = require("./dislike.routes");
const chatRoutes = require("./chat.routes")
const deviceRouter = require("./device.routes");
const dateRouter = require("./date.routes")
const specialDate = require("./specialDate.routes")
const categoryRoute = require("./category.route")
const subCategory = require("./subCategory.route")
const matchUser = require("./match.routes")
const goalRoute = require("./goal.routes")
const noteRoute = require("./note.routes")
const superLikeRoute = require("./superlike.route")
const educationRoute = require("./eduction.routes")
const hangoutRoute = require("./hangout.routes")
const reportRoute = require("./report.routes")
const groupRoute = require("./group.routes")

router.use("/user", user);

router.use("/auth", auth);

router.use("/pushnotification", deviceRouter);

router.use("/file", file);

router.use("/like", like);

router.use("/chat", chatRoutes)

router.use("/dislike", dislike);

router.use("/date", dateRouter)

router.use("/sepcialdate", specialDate)

router.use("/category", categoryRoute)

router.use("/subcategory", subCategory)

router.use("/match", matchUser)

router.use("/goal", goalRoute)

router.use("/note", noteRoute)

router.use("/superlike", superLikeRoute)

router.use("/education", educationRoute)

router.use("/hangout", hangoutRoute)

router.use("/report", reportRoute)

router.use("/group", groupRoute)

module.exports = router;
