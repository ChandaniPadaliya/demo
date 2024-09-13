const ChatService = require("../controller/chat/chat");
const { AIChat } = require("../controller/chat/chat")
const activeUsers = new Set();
const set = new Set();
let userActive = []
exports.setup = function (io) {
  io.on("connection", (socket) => {
    console.log('connection: -=-=-=-=');
    socket.on("connectUser", async function ({ userId }) {
      socket.userId = userId;
      activeUsers.add(String(socket.userId));
    });

    socket.on("onlineUser", async function ({ userId }) {
      let participates = JSON.parse(
        JSON.stringify(await ChatService.getAllUserList())
      );

      set.add(userId);

      if (!userActive.includes(userId)) {
        userActive.push(userId)
      }

      io.in(socket.id).emit("activeUser", userActive);

    });

    socket.on("offlineUser", async function ({ userId }) {


      const idfind = (ele) => ele == socket.userId
      let index = userActive.findIndex(idfind)
      userActive.splice(index, 1)

      io.in(socket.id).emit("activeUser", userActive);

    });

    socket.on("join", async function ({ roomId, userId, opuser, pagenumber, pagesize, type }) {
      socket.leave(socket.userId);
      socket.userId = roomId;
      activeUsers.add(userId);
      socket.join(roomId);

      try {
        let chats = await ChatService.getByRoom({
          roomId,
          userId,
          opuser,
          pagenumber,
          pagesize,
          type
        });
        io.in(socket.userId, socket.opuser).emit("history", {
          chats: chats,
        });
      } catch (error) {
        console.log("error: ", error);
      }
    });

    socket.on("get-chat-data", async function ({ roomId, userId, pagenumber, pagesize }) {
      try {
        let chats = await ChatService.getByRoom({
          roomId,
          userId,
          pagenumber,
          pagesize,
        });
        io.in(socket.userId).emit("history", {
          chats: chats,
        });
      } catch (error) {
        console.log("error: ", error);
      }
    });

    socket.on("typing", async function ({ roomId, userId, isTyping, opuser }) {
      try {
        let typing = await ChatService.typing({
          roomId,
          userId,
          isTyping,
        });
        io.in(socket.userId, socket.opuser).emit("typing", typing);
      }
      catch (error) {
        console.log("error: ", error);
      }
    });

    socket.on("call", async function ({ name, image, roomId, userId, type, opuser }) {
      try {
        let typing = await ChatService.call({
          name,
          image,
          roomId,
          userId,
          type,
          opuser,
        });
        typing = JSON.parse(JSON.stringify(typing));
        io.in(userId).emit("call", typing);
        io.to(opuser).emit("call", typing);
        io.emit("call", typing)
      }
      catch (error) {
        console.log("error: ", error);
      }
    });

    socket.on("call-status", async function ({ status, roomId, userId, opuser }) {
      try {
        let typing = await ChatService.callstatus({

          roomId,
          userId,
          opuser,
          status
        });
        typing = JSON.parse(JSON.stringify(typing));
        io.in(roomId).emit("call-status", typing);
        socket.broadcast.emit(`listing-${roomId}`, typing);
        io.in(userId).emit("call-status", typing);
        io.emit("call-status", typing)
      }
      catch (error) {
        console.log("error: ", error);
      }
    });

    socket.on("online", async function ({ roomId, userId, isOnline, opuser }) {
      try {
        let typing = await ChatService.online({
          roomId,
          userId,
          isOnline,
        });
        io.in(socket.userId, socket.opuser).emit("online", typing);
      }
      catch (error) {
        console.log("error: ", error);
      }
    });

    socket.on("isread", async function ({ roomId, userId }) {
      try {
        let read = await ChatService.isread({
          roomId,
          userId,
        });
        io.in(socket.userId).emit("isread", read);
      }
      catch (error) {
        console.log("error: ", error);
      }
    });

    socket.on("get-rooms", async function ({ userId, pagenumber, pagesize }) {
      try {
        let getAllRoomByUser = await ChatService.getRoomByUser({
          userId,
          pagenumber,
          pagesize,
        });
        getAllRoomByUser = JSON.parse(JSON.stringify(getAllRoomByUser));
        io.in(socket.id).emit("get-rooms", getAllRoomByUser);
      } catch (error) {
        console.log("AL: error", error);
      }
    });

    socket.on("new-message",
      async function ({
        roomId,
        sender,
        message,
        attach,
        messageType,
        mediaName,
        userId,
        type
      }) {
        try {
          let newMsg = await ChatService.add({
            roomId: roomId,
            sender: sender,
            message: message,
            attach: attach,
            messageType: messageType,
            mediaName: mediaName,
            userId: userId,
            type: type
          });
          newMsg = JSON.parse(JSON.stringify(newMsg));
          io.in(roomId).emit("new-message", newMsg);
          socket.broadcast.emit(`listing-${roomId}`, newMsg);

          let getAllRoomByUser = await ChatService.getRoomByUser({
            userId,
          });
          getAllRoomByUser = JSON.parse(JSON.stringify(getAllRoomByUser));
          io.to(userId).emit("new-room-message", newMsg);
          io.emit("new-room-message", newMsg)
        } catch (error) {
          console.log("error: ", error);
        }
      }
    );

    socket.on("Ai-user-message", async function ({ message, roomId, userId, }) {
      try {
        let newMsg = await ChatService.AI({
          message,
          roomId,
          userId
        });
        newMsg = JSON.parse(JSON.stringify(newMsg));
        io.in(roomId).emit("Ai-user-message", newMsg);
        let typing
        typing = await ChatService.typing({
          roomId,
          userId: "0",
          isTyping: true,
        });
        io.in(socket.userId,).emit("typing", typing);


        let AIresponse = await ChatService.AIChat({ message, roomId, userId })
        AIresponse = JSON.parse(JSON.stringify(AIresponse));
        io.in(roomId).emit("Ai-user-message", AIresponse);
        typing = await ChatService.typing({
          roomId,
          userId: "0",
          isTyping: false,
        });
        io.in(socket.userId,).emit("typing", typing);

        socket.broadcast.emit(`listing-${roomId}`, newMsg);

        let getAllRoomByUser = await ChatService.getByRoom({
          roomId,
          userId,
          type: "AI"
        });
        getAllRoomByUser = JSON.parse(JSON.stringify(getAllRoomByUser));
        io.to(userId).emit("new-room-message", newMsg);
        io.emit("new-room-message", newMsg)

      } catch (error) {
        console.log("error: ", error);
      }
    });

    socket.on("edit-message",
      async function ({
        roomId,
        sender,
        message,
        messageId,
      }) {
        try {
          let newMsg = await ChatService.editMessage({
            roomId: roomId,
            sender: sender,
            message: message,
            messageId: messageId,
          });
          newMsg = JSON.parse(JSON.stringify(newMsg));
          io.in(roomId).emit("edit-message", newMsg);
          socket.broadcast.emit(`listing-${roomId}`, newMsg);

        } catch (error) {
          console.log("error: ", error);
        }
      }
    );

    socket.on("delete-message", async function ({ chatId, userId, roomId, type }) {
      try {
        await ChatService.delete({
          chatId,
          userId,
        });

        let chats = await ChatService.getByRoom({ roomId, userId, type });
        io.in(socket.id).emit("history", {
          chats: chats,
        });

      } catch (error) {
        console.log("error: ", error);
      }
    });

    socket.on("delete", async function ({ roomId, userId, type }) {
      try {
        await ChatService.deleteFromRoom({
          roomId,
          userId,
        });

        let chats = await ChatService.getByRoom({ roomId, userId, type });
        io.in(socket.id).emit("history", {
          chats: chats,
        });

      } catch (error) {
        console.log("error: ", error);
      }
    });

    socket.on("join-group-chat", async function ({ roomId, member, opuser, pagenumber, pagesize }) {
      try {
        let join = await ChatService.joinGroupChat({
          roomId,
          member,
          opuser
        });
        let chats = await ChatService.getByRoomGroup({
          roomId,
          opuser,
          pagenumber,
          pagesize,
          type: "group"
        });
        newMsg = JSON.parse(JSON.stringify(join));
        // io.in(opuser).emit("history", { chats: chats });
        socket.broadcast.emit(`listing-${roomId}`, join);
        io.in(socket.id).emit("history", {
          chats: chats,
        });
        io.to(member).emit("new-room-message", newMsg);
        io.emit("new-message", newMsg)


      } catch (error) {
        console.log("error: ", error);
      }
    });

    socket.on("getTimeUser", async function ({ roomId, user }) {
      try {
        let typing = await ChatService.getTimeUser({
          roomId,
          user,
        });

        io.in(socket.id).emit("getTimeUser", typing);


      } catch (error) {
        console.log("error: ", error);
      }
    });

    socket.on("removeGroupChat", async function ({ roomId, member, admin, opuser, pagenumber, pagesize }) {
      try {
        let join = await ChatService.removeGroupChat({
          roomId,
          member,
          admin,
          opuser
        });
        let chats = await ChatService.getByRoom({
          roomId,
          opuser,
          pagenumber,
          pagesize,
          type: "group"
        });
        newMsg = JSON.parse(JSON.stringify(join));
        // io.in(opuser, member).emit("history", { chats: chats });
        socket.broadcast.emit(`listing-${roomId}`, join);
        io.in(socket.id).emit("history", {
          chats: chats,
        });

        // let getAllRoomByUser = await ChatService.getByRoomGroup({
        //   opuser,
        // });
        getAllRoomByUser = JSON.parse(JSON.stringify(getAllRoomByUser));
        io.to(member).emit("new-room-message", newMsg);
        io.emit("new-message", newMsg)

      } catch (error) {
        console.log("error: ", error);
      }
    });

    // socket.on("removeGroupChat", async function ({ roomId, member, admin, opuser, pagenumber, pagesize }) {
    //   try {
    //     let join = await ChatService.removeGroupChat({
    //       roomId,
    //       member,
    //       admin,
    //       opuser
    //     });
    //     let chats = await ChatService.getByRoom({
    //       roomId,
    //       opuser,
    //       pagenumber,
    //       pagesize,
    //       type: "group"
    //     });
    //     newMsg = JSON.parse(JSON.stringify(join));
    //     socket.broadcast.emit(`listing-${roomId}`, join);
    //     io.to(member, opuser).emit("new-room-message", newMsg);
    //     //     io.emit("new-room-message", newMsg)
    //     io.in(socket.id).emit("history", {
    //       chats: chats,
    //     });

    //   } catch (error) {
    //     console.log("error: ", error);
    //   }
    // });

    socket.on("leaveGroupChat", async function ({ roomId, user, opuser, pagenumber, pagesize }) {
      try {
        let join = await ChatService.leaveGroupChat({
          roomId,
          user,
          opuser
        });
        let chats = await ChatService.getByRoomGroup({
          roomId,
          opuser,
          pagenumber,
          pagesize,
          type: "group"
        });
        newMsg = JSON.parse(JSON.stringify(join));
        socket.broadcast.emit(`listing-${roomId}`, join);
        io.in(socket.id).emit("history", {
          chats: chats,
        });

      } catch (error) {
        console.log("error: ", error);
      }
    });

    socket.on("delete", async function ({ roomId, userId, type }) {
      try {
        await ChatService.deleteFromRoom({
          roomId,
          userId,
          type
        });

        let chats = await ChatService.getByRoom({ roomId, userId, type });
        io.in(socket.id).emit("history", {
          chats: chats,
        });

      } catch (error) {
        console.log("error: ", error);
      }
    });

    socket.on("error", function (err) {
      console.log("err: ", err);
    });

    socket.on("disconnect", async function () {
      socket.leave(socket.id);
      delete activeUsers[socket.userId];

      const idfind = (ele) => ele == socket.userId
      let index = userActive.findIndex(idfind)
      userActive.splice(index, 1)

      console.log('disconnect:-=-=-= ', socket.userId);
    });

  });
};

module.exports = exports;