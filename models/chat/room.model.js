const mongoose = require("mongoose");
const { User } = require("../user.model");
const { Group } = require("../group.model")
const RoomSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    opuser: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    }],
    removeUser: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    }],
    isAI: {
      type: Boolean,
      default: false
    },
    isMagessge: {
      type: Boolean,
      default: false
    },
    groupName: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      enum: ["group", "o2o", "AI"]
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Group,
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    latestmessage: {
      type: Object,
      default: {
        createdAt: new Date().getTime(),
      }
    },
    isArchived: {
      type: Boolean,
      default: false
    },
    ArchivedUser: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: User
    }],
    mute: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: User
    }],
    isNotification: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: User
    }],
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

const ChatRoom = mongoose.model("ChatRoom", RoomSchema);

exports.ChatRoom = ChatRoom;
