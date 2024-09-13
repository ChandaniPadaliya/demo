const { Like } = require("../../models/like.model");
const { User } = require("../../models/user.model");
const serviceUser = require("../../services/mongoDbService")({ model: User });
const serviceLike = require("../../services/mongoDbService")({ model: Like });
const message = require("../../utils/messages");
const responceCode = require("../../utils/responseCode");
const gcm = require("node-gcm");

exports.likeCreate = async (req,) => {
  try {
    let { id } = req.params
    let reqUser = req.user;

    let likeUser = await serviceUser.getSingleDocumentById(id);
    if (!likeUser) {
      return message.badRequest(
        responceCode.badRequest,
        "please enter valid reference id"
      );
    }

    let userLike = await serviceLike.getSingleDocumentByQuery({ user: reqUser._id });
    if (userLike) {
      let isFollow = []
      isFollow = userLike.yourLike
      if (isFollow.includes(id)) {
        return message.successResponse(
          responceCode.success,
          {}
        );
      } else {
        isFollow.push(id)
        userLike = userLike.toJSON();
        userLike.yourLike = isFollow
        serviceLike.findOneAndUpdateDocument({ _id: userLike._id }, userLike, { new: true });
      }
    } else {
      let data = {
        user: reqUser._id,
        like: [],
        yourLike: [id],
        superLike: []
      };
      serviceLike.createDocument(data);
    }

    let userLikeYour = await serviceLike.getSingleDocumentByQuery({ user: id });
    if (userLikeYour) {
      let isFollows = []
      isFollows = userLikeYour.like
      if (isFollows.includes(reqUser._id)) {
        return message.successResponse(
          responceCode.success,
          {}
        );
      } else {
        isFollows.push(reqUser._id)
        userLikeYour = userLikeYour.toJSON();
        userLikeYour.like = isFollows
        await serviceLike.findOneAndUpdateDocument({ _id: userLikeYour._id }, userLikeYour, { new: true });
      }
    } else {
      let data = {
        user: id,
        like: [reqUser._id],
        yourLike: [],
        superLike: []
      };
      serviceLike.createDocument(data);
    }

    let likeUserDevice = await serviceUser.getSingleDocumentByQuery({ _id: id, isNotification: true });
    if (likeUserDevice) {
      const messages = new gcm.Message({
        to: "device",
        notification: {
          title: "like your profile",
          body: "like",
          "color": "#e50012",
          priority: "high",
          group: "GROUP",
          sound: "default",
          show_in_foreground: true,
        },
        data: {
          id: "",
          type: "",
        },
      });
      const send = new gcm.Sender(
        "AAAA7OtooCU:APA91bHtP6fDPvzXBVPaXWItn5p6MgjMxjNrpFpBfZmLimQhNd98SgrInmvsVxFS_vzOhXEju1InjDQikJfrrWPyxlElR8TdjejoIimNEiPL-fGszJ8RYaxxjxELkVnKLizkGa_mkP8q"
      );
      await send.send(
        messages,
        {
          registrationTokens: [likeUserDevice.deviceToken]
        },
        function (err, res) {
          if (err) {
            console.log("notication err     ios :>> ", err);
          }

        }
      )
    }
    reqUser.yourLike = [...reqUser.yourLike, id.toString()];

    await serviceUser.findOneAndUpdateDocument({ _id: reqUser._id.toString() }, reqUser, { new: true });

    return message.successResponse(
      responceCode.success,
      {}
    );
  } catch (error) {
    console.log('error: ', error);
    return message.failureResponse(
      responceCode.internalServerError, error
    );
  }
};

exports.disLikeCreate = async (req,) => {
  try {
    let { id } = req.params;
    let reqUser = req.user;

    let disLikeUser = await serviceUser.getSingleDocumentById(id);
    if (!disLikeUser) {
      return message.badRequest(
        responceCode.badRequest,
        "please enter valid reference id"
      );
    }

    let userDisLike = await serviceLike.getSingleDocumentByQuery({ user: reqUser._id });
    if (userDisLike) {
      let isFollow = []

      isFollow = userDisLike.disLike
      if (isFollow.includes(id)) {
        return message.successResponse(
          responceCode.success
        )
      } else {
        isFollow.push(id)
        userDisLike = userDisLike.toJSON();
        userDisLike.disLike = isFollow
        await serviceLike.findOneAndUpdateDocument({ _id: userDisLike._id }, userDisLike, { new: true });
      }
    } else {
      let data = {
        user: reqUser._id,
        disLike: [id],
        like: [],
        yourLike: [],
        superLike: []
      };
      serviceLike.createDocument(data);
    }

    reqUser.disLike = [...reqUser.disLike, id.toString()];
    let superLike1 = []
    let superLike2 = []

    await serviceUser.findOneAndUpdateDocument({ _id: reqUser._id.toString() }, reqUser, { new: true });
    let userUpdate = await serviceLike.getSingleDocumentByQuery({ user: req.user._id })
    superLike1 = userUpdate.yourLike

    if (superLike1.includes(id)) {
      const idfind = (ele) => ele == id
      let index = superLike1.findIndex(idfind)
      superLike1.splice(index, 1)
      let a = await serviceLike.findOneAndUpdateDocument({ user: req.user._id }, userUpdate, { new: true })
    }
    let userUpdate1 = await serviceLike.getSingleDocumentByQuery({ user: req.user._id })
    superLike2 = userUpdate1.superLike

    if (superLike2.includes(id)) {
      const idfind = (ele) => ele == id
      let index = superLike2.findIndex(idfind)
      superLike2.splice(index, 1)
      let a = await serviceLike.findOneAndUpdateDocument({ user: req.user._id }, userUpdate1, { new: true })
    }
    return message.successResponse(
      responceCode.success,
      {}
    );
  } catch (error) {
    console.log('error: ', error);
    return message.failureResponse(
      responceCode.internalServerError,

    );
  }
};

exports.superlikeCreate = async (req,) => {
  try {
    let { id } = req.params;
    let reqUser = req.user;

    let likeUser = await serviceUser.getSingleDocumentById(id);
    if (!likeUser) {
      return message.badRequest(
        responceCode.badRequest,
        "please enter valid reference id"
      );
    }

    let userLike = await serviceLike.getSingleDocumentByQuery({ user: reqUser._id });
    if (userLike) {
      let isFollow = []

      isFollow = userLike.superLike
      if (isFollow.includes(id)) {
        return message.successResponse(
          responceCode.success
        )
      } else {
        isFollow.push(id)
        userLike = userLike.toJSON();
        userLike.superLike = isFollow
        await serviceLike.findOneAndUpdateDocument({ _id: userLike._id }, userLike, { new: true });
      }
    } else {
      let data = {
        user: reqUser._id,
        superLike: [id],
        yourLike: [],
        like: []
      };
      serviceLike.createDocument(data);
    }
    reqUser.superLike = [...reqUser.superLike, id];

    serviceUser.findOneAndUpdateDocument({ _id: reqUser._id.toString() }, reqUser, { new: true });

    let superLike1 = []
    let userUpdate = await serviceLike.getSingleDocumentByQuery({ user: req.user._id })
    superLike1 = userUpdate.yourLike

    if (superLike1.includes(id)) {
      const idfind = (ele) => ele == id
      let index = superLike1.findIndex(idfind)
      superLike1.splice(index, 1)
      let a = await serviceLike.findOneAndUpdateDocument({ user: req.user._id }, userUpdate, { new: true })
    }
    return message.successResponse(
      responceCode.success
    );
  } catch (error) {
    return message.failureResponse(
      responceCode.internalServerError,
      "somthing went to wroung" + error
    );
  }
};
