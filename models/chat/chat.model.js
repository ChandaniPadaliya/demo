const mongoose = require("mongoose");
const { ChatRoom } = require("./room.model");
const { User } = require("../user.model");

const ChatSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ChatRoom,
      require: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    message: {
      type: String,
    },
    messageType: {
      type: String,
    },
    isAI: {
      type: Boolean,
      default: false
    },
    response: {
      type: String
    },
    attach: {
      type: String,
    },
    mediaName: {
      type: String,
    },
    readBy: {
      type: Array,
    },
    block: [{
      type: String
    }],
    isRead: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", ChatSchema);

exports.Chat = Chat;
