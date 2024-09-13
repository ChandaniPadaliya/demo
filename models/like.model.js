const mongoose = require("mongoose");
const { User } = require("./user.model");

const likeSchema = mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User
  },
  like: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: User
    }
  ],
  disLike: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: User
    },
  ],
  superLike: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: User
    }
  ]
  ,
  yourLike: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: User
    },
  ]

});

const Like = mongoose.model("Like", likeSchema);
exports.Like = Like;
