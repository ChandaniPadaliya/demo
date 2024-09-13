const express = require("express");
const router = express.Router();
const chat = require("../controller/chat/chat");
// const {  } = require("../middleware/auth.mdl");

const user = require("../controller/chat/chatCron")


const cronJob = require('node-cron');
const { auth } = require("../middleware/auth.mdl");


// cronJob.schedule("* * * * * *", () => {
//     user.cron();
// })


// get all ChatRooms of user
router.get("/allrooms", chat.getAllChatRoom);

// get all ChatRooms of user
// router.get("/users-rooms", authUser, chat.getAllChatRoomByUser);

// Initiate Room
router.post("/chat-initiate", auth, chat.initiateChat);

// lastSeen 
router.get("/last-seen/:id", auth, chat.getTimeUser)

// Send message
router.post("/send-message", auth, chat.sendMessage);

// Get msg history all
router.get("/allmessages", auth, chat.allMessages);



// Get user's msg history by roomID
router.post("/user-msgs", auth, chat.msgByRoom);

// Get user's msg history by roomID
// router.put("/read-messages", auth, chat.readMsgs);
//
router.delete("/delete", chat.delete)

router.delete("/delete-room", chat.deleteFromRoom)

router.put("/archived", chat.isArchived)

router.put("/mute", chat.mute)

router.put("/room-update", chat.updateRoom)

router.put("/notificatinupdate", auth, chat.getRoomUpdate)

router.post("/removeChat", auth, chat.removeChat)

router.post("/leave/:id", auth, chat.leaveGroup)

router.get("/media/:id", chat.mediaGet)



module.exports = router;