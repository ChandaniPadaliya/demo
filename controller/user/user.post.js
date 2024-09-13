const { User } = require("../../models/user.model");
const serviceUser = require("../../services/mongoDbService")({ model: User });
const message = require("../../utils/messages");
const responceCode = require("../../utils/responseCode");
const { Device } = require("../../models/device.model");
const { sendMessage, sendIos } = require("../../utils/notification");
const { appInstall } = require("../../models/onlyAppInstall.model");
const { Feedback } = require("../../models/feedback.model");
const { FeedbackUser } = require("../../models/feedbackUser.model");
const { Survey, SurveyUser } = require("../../models/survey.model");
const { ChatRoom } = require("../../models/chat/room.model");
const serviceDevice = require("../../services/mongoDbService")({ model: Device })
const mongoDbServiceUserInstall = require("../../services/mongoDbService")({ model: appInstall })
const mongoDbServiceFeedback = require("../../services/mongoDbService")({ model: Feedback })
const mongoDbServiceFeedbackUser = require("../../services/mongoDbService")({ model: FeedbackUser })
const mongoDbServiceSurvey = require("../../services/mongoDbService")({ model: Survey })
const mongoDbServiceSurveyUser = require("../../services/mongoDbService")({ model: SurveyUser })
const mongoDbserviceChatRoom = require("../../services/mongoDbService")({ model: ChatRoom })

const gcm = require("node-gcm");

exports.register = async (req) => {
  try {
    let reqBody = req.body;

    let getByUserWithEmail
    if (req.body.loginType == "Phone") {
      getByUserWithEmail = await serviceUser.getSingleDocumentByQuery(
        { phone: reqBody.phone, isDeleted: false }
      );
    } else {
      getByUserWithEmail = await serviceUser.getSingleDocumentByQuery(
        { email: reqBody.email, isDeleted: false }
      );
    }
    if (getByUserWithEmail) {
      return message.isAssociated(
        responceCode.found
      );
    }

    let birtDate = new Date(reqBody.birthDate);
    let newDate = new Date();
    var diff = newDate.getTime() - birtDate.getTime();
    reqBody["age"] = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));

    reqBody["location"] = {
      type: "Point",
      coordinates: [reqBody.long, reqBody.lat]
    };

    if (!reqBody || reqBody.loginType == "Google" && !reqBody.email) {
      return message.inValidParam(
        responceCode.validationError,
        "please enter all mandatory fields"
      );
    }

    let user = await serviceUser.createDocument(reqBody);
    user = await serviceUser.getSingleDocumentById(
      user._id)
    let token = user.generateToken();

    const messages = new gcm.Message({
      to: "device",
      notification: {
        title: "Congrats! Let's sign up for free 🎉",
        body: "Give your life ",
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
        registrationTokens: [user.deviceToken]
      },
      function (err, res) {
        if (err) {
          console.log("notication err     ios :>> ", err);
        }

      }
    )
    const createdUser = user.toJSON();
    const returnData = {
      ...createdUser,
      ...{ token }
    };

    let chatroom = {
      userId: user._id,
      isAI: true,
      type: "AI"
    };
    await mongoDbserviceChatRoom.createDocument(chatroom)

    return message.successResponse(
      responceCode.success,
      returnData
    );

  } catch (error) {
    console.log("error: ", error);
    return message.failureResponse(
      responceCode.internalServerError,
      error
    );
  }
};

exports.joinNotification = async (req, res) => {
  try {
    let { type } = req.query
    console.log('req.query: ', req.query);
    let { id } = req.params
    let device = []

    let user = await serviceUser.getSingleDocumentByQuery({ _id: id })
    device.push(user.deviceToken)
    let name = await serviceUser.getSingleDocumentByQuery({ _id: req.user._id })
    let title, body
    if (type == "call") {
      console.log('call: ',);
      title = `${user.fullName}`;
      body = `Incoming voice call `;
      user = req.user._id;
      name = user.fullName
    }
    if (type == "video") {
      console.log('video: ');
      title = `${user.fullName}`;
      body = `Incoming video call `;
      user = req.user._id;
      name = name.fullName
    }
    const messages = new gcm.Message({
      to: "device",
      notification: {
        title: title,
        body: body,
        "color": "#e50012",
        priority: "high",
        group: "GROUP",
        sound: "default",
        show_in_foreground: true,
      },
      data: {
        id: "",
        type: req.query.type,
      },
    });
    const send = new gcm.Sender(
      "AAAA7OtooCU:APA91bHtP6fDPvzXBVPaXWItn5p6MgjMxjNrpFpBfZmLimQhNd98SgrInmvsVxFS_vzOhXEju1InjDQikJfrrWPyxlElR8TdjejoIimNEiPL-fGszJ8RYaxxjxELkVnKLizkGa_mkP8q"
    );
    await send.send(
      messages,
      {
        registrationTokens: device
      },
      function (err, res) {
        console.log('res: ', res);
        if (err) {
          console.log("notication err     ios :>> ", err);
        }

      }
    )

    return message.successResponse(
      responceCode.success
    );

  } catch (error) {
    console.log("🚀 ~ file: notification.put.js ~ line 33 ~ exports.updateRead= ~ error", error);
    return message.invalidRequest(
      responceCode.internalServerError
    );
  }
}

exports.block = async (req) => {
  try {
    let { id } = req.params;

    let isFollow = []
    let userFind = await serviceUser.getSingleDocumentById(req.user._id)
    if (!userFind) {
      return message.inValidParam(
        responceCode.notFound
      )
    }
    isFollow = userFind.block
    if (isFollow.includes(id)) {
      return message.successResponse(
        responceCode.success
      )
    } else {
      isFollow.push(id)
      userFind = userFind.toJSON();
      userFind.block = isFollow

      await serviceUser.findOneAndUpdateDocument({ _id: req.user._id }, userFind, { new: true })

      return message.successResponse(
        responceCode.success, {}
      )
    }
  } catch (err) {
    console.log('err: ', err);
    return message.failureResponse(
      responceCode.internalServerError
    )
  }
}

exports.unblock = async (req) => {
  try {
    let { id } = req.params

    let isFollow = []
    let userFind = await serviceUser.getSingleDocumentById(req.user._id)
    if (!userFind) {
      return message.inValidParam(
        responceCode.notFound
      )
    }
    isFollow = userFind.block
    if (isFollow.includes(id)) {
      const idfind = (ele) => ele == id
      let index = isFollow.findIndex(idfind)
      isFollow.splice(index, 1)

      userFind = await serviceUser.findOneAndUpdateDocument({ _id: req.user._id }, userFind, { new: true })

      return message.successResponse(
        responceCode.success, {}
      )
    } else {
      return message.successResponse(
        responceCode.success
      )
    }
  } catch (err) {
    console.log('err: ', err);
    return message.failureResponse(
      responceCode.internalServerError
    )
  }
}

exports.userInstall = async (req) => {
  try {
    let get = await mongoDbServiceUserInstall.getSingleDocumentByQuery({ token: req.body.token })
    if (get) {
      return message.successResponse(
        responceCode.success, {}
      )
    }
    await mongoDbServiceUserInstall.createDocument(req.body)
    return message.successResponse(
      responceCode.success, {}
    )
  } catch (err) {
    console.log('err: ', err);
    return message.failureResponse(
      responceCode.internalServerError
    )
  }
}

exports.FeedbackCreate = async (req) => {
  try {
    let { name } = req.body
    let findCategory = await mongoDbServiceFeedback.getSingleDocumentByQuery({ name })
    if (findCategory) {
      return message.isAssociated(
        responceCode.found,
      );
    }
    if (!name) {
      return message.invalidRequest(
        responceCode.badRequest,
        "name is require"
      )
    }
    let category = {
      name
    }

    let createCategory = await mongoDbServiceFeedback.createDocument(category)
    return message.successResponse(
      responceCode.success, createCategory
    )
  } catch (err) {
    console.log('err: ', err);
    return message.failureResponse(
      responceCode.internalServerError
    )
  }
}

exports.FeedbackUserCreate = async (req) => {
  try {
    let { email, feedback } = req.body
    let findCategory = await mongoDbServiceFeedbackUser.getSingleDocumentByQuery({ email })
    if (findCategory) {
      return message.isAssociated(
        responceCode.found,
      );
    }

    let category = {
      email,
      feedback
    }

    let createCategory = await mongoDbServiceFeedbackUser.createDocument(category)
    return message.successResponse(
      responceCode.success, createCategory
    )
  } catch (err) {
    console.log('err: ', err);
    return message.failureResponse(
      responceCode.internalServerError
    )
  }
}

exports.SurveyCreate = async (req) => {
  try {
    let { title, options } = req.body

    let Survey = {
      title,
      options
    }

    let Surveycreate = await mongoDbServiceSurvey.createDocument(Survey)
    return message.successResponse(
      responceCode.success, Surveycreate
    )
  } catch (err) {
    console.log('err: ', err);
    return message.failureResponse(
      responceCode.internalServerError
    )
  }
}

exports.SurveyUserCreate = async (req) => {
  try {
    let { title, options, email } = req.body

    let Survey = {
      title,
      options,
      email
    }

    let Surveycreate = await mongoDbServiceSurveyUser.createDocument(Survey)
    return message.successResponse(
      responceCode.success, Surveycreate
    )
  } catch (err) {
    console.log('err: ', err);
    return message.failureResponse(
      responceCode.internalServerError
    )
  }
}