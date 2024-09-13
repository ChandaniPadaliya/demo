const { User } = require("../../models/user.model");
const serviceUser = require("../../services/mongoDbService")({ model: User });
const message = require("../../utils/messages");
const responceCode = require("../../utils/responseCode");
const { Like } = require("../../models/like.model");
const { ChatRoom } = require("../../models/chat/room.model");
const { userDelete } = require("../../models/userDelete.model");
const { Feedback } = require("../../models/feedback.model");
const { Survey } = require("../../models/survey.model");
const serviceLike = require("../../services/mongoDbService")({ model: Like });
const mongoDbserviceChatRoom = require("../../services/mongoDbService")({ model: ChatRoom })
const mongoDbserviceUserDelete = require("../../services/mongoDbService")({ model: userDelete })
const mongoDbServiceFeedback = require("../../services/mongoDbService")({ model: Feedback })
const mongoDbServiceSurvey = require("../../services/mongoDbService")({ model: Survey })

// var fs = require("fs");

exports.getAll = async (req,) => {
  try {
    let reqUser = req.user;
    let reqQuery = req.query;
    let query = {
      _id: {
        $ne: reqUser._id
      },
      $and: [{ "_id": { $nin: [reqUser.yourLike] } },
      { "_id": { $nin: [reqUser.disLike] } }],
      isDeleted: false, isUserGenerated: true, snooze: 1
      // _id: { $nin: reqUser.like },
      // _id: { $nin: reqUser.disLike },
      // gender: { $nin: [reqUser.gender] }
    }

    let categoryJson = [],
      cat = {};
    let users = await serviceUser.getSingleDocumentById(reqUser._id)

    // Initialize an empty array to store filtering conditions

    // Check if there is an interest specified
    if (reqQuery.interested) {
      // Initialize default radius
      let radius = 30 * 0.621371;
      if (req.query.radius) {
        radius = req.query.radius * 0.621371 || 30;
      }

      // Handle "Everyone" interest case
      if (reqQuery.interested == "Everyone") {
        let cat = {
          $and: [
            { _id: { "$ne": reqUser._id.toString() } },
            { isDeleted: false, isUserGenerated: true },
            { _id: { $nin: reqUser.yourLike } },
            { _id: { $nin: reqUser.disLike } }
          ]
        };
        categoryJson.push(cat);
      }

      // Handle specific gender interests
      if (reqQuery.interested == "Male" || reqQuery.interested == "Female" || reqQuery.interested == "Others") {
        let cat = {
          $and: [
            { gender: reqQuery.interested },
            { _id: { $nin: reqUser.yourLike } },
            { _id: { $nin: reqUser.disLike } },
            // {
            //   location: {
            //     $geoWithin: {
            //       $centerSphere: [[reqQuery.long, reqQuery.lat], radius / 3963.2],
            //     },
            //   }
            // }
          ]
        };
        categoryJson.push(cat);
      }
    } else {
      cat = {};
      cat = {

        $and: [{ gender: { $ne: users.gender } },
        { "_id": { $nin: reqUser.yourLike } },
        { "_id": { $nin: reqUser.disLike } }]
      };
      categoryJson = [];
      categoryJson.push(cat);
      query["$and"] = categoryJson;
    }

    // Check if latitude and longitude are provided and not zero
    if (reqQuery.lat && reqQuery.long && (reqQuery.lat != 0.0 && reqQuery.long != 0.0)) {
      let radius = 30 * 0.621371;
      if (req.query.distance) {
        radius = req.query.distance * 0.621371 || 30;
      }

      let options = {
        location: {
          $geoWithin: {
            $centerSphere: [[parseFloat(reqQuery.long), parseFloat(reqQuery.lat)], parseFloat(radius / 3963.2)],
          },
        }
      };
      categoryJson.push({ $and: [options, { _id: { $nin: reqUser.yourLike } }, { _id: { $nin: reqUser.disLike } }] });
    }

    // Check if distance is specified
    if (reqQuery.distance) {
      let radius = 10 * 0.621371;

      if (reqQuery.distance) {
        radius = reqQuery.distance * 0.621371 || radius;
      }
      let options = {
        location: {
          $geoWithin: {
            $centerSphere:
              [[parseFloat(reqQuery.long), parseFloat(reqQuery.lat)], parseFloat(radius / 3963.2)],
          },
        }
      };
      cat = {}
      cat = {
        $and: [options, { _id: { $nin: reqUser.yourLike } }, { _id: { $nin: reqUser.disLike } }]
      };
      categoryJson = [];
      categoryJson.push(cat);
      query["$and"] = categoryJson;
    }

    // Check if age range is specified
    if (reqQuery.age) {
      let age = reqQuery.age.split("-");
      if (age.length === 2 && age[0] <= age[1]) {
        let cat = {
          $and: [
            { age: { $gte: age[0], $lte: age[1] } },
            { isDeleted: false, isUserGenerated: true },
            { _id: { $nin: reqUser.yourLike } },
            { _id: { $nin: reqUser.disLike } }
          ]
        };
        categoryJson.push(cat);
      }
    }

    // Construct the final query
    query["$and"] = categoryJson;

    // Execute the query to fetch the data

    let user = await serviceUser.getDocumentByQuery(
      query
    )


    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements at i and j
      }
      return array;
    }

    // Get a random object from the data array
    const shuffledData = shuffleArray(user);

    return message.successResponse(
      responceCode.success,
      shuffledData
    );
  } catch (error) {
    console.log("error: ", error);
    return message.failureResponse(
      responceCode.internalServerError,
      error
    );
  }
};

exports.getAllByAdmin = async () => {
  try {
    // let reqQuery = req.query
    let user = await serviceUser.getDocumentByQuery({});

    return message.successResponse(
      responceCode.success,
      user
    );
  } catch (error) {
    console.log("error: ", error);
    return message.failureResponse(
      responceCode.internalServerError,
      error
    );
  }
};

exports.getOne = async (req,) => {
  try {
    let { id } = req.params
    let populate = [{
      path: "block",
      select: "_id fullName address profile  lifestyle birthDate  about profession gender email age yourLike"
    }, { path: "lifestyle", select: "_id name" }, { path: "education", select: "_id name" }]
    let yourLike = false, superLike = false
    let user = await serviceUser.getSingleDocumentByIdPopulate(
      id, [], populate
    );
    let likeUser = await serviceLike.getSingleDocumentByQuery({ user: req.user._id })
    if (likeUser) {
      let isFollow = [], superlike = []
      isFollow = likeUser.yourLike
      superlike = likeUser.superLike

      if (isFollow.includes(id)) {
        yourLike = true
      } else {
        yourLike = false
      }
      if (superlike.includes(id)) {
        superLike = true
      } else {
        superLike = false
      }
    }

    let returnData = user.toJSON();
    delete returnData.isDeleted;
    delete returnData.loginType;
    delete returnData.govDocs;
    delete returnData.__v;
    let isBlock;
    let useryou = await serviceUser.getSingleDocumentById(
      req.user._id
    );
    if (useryou.block.includes(id)) {
      isBlock = true
    } else {
      isBlock = false
    }
    let chatRoom = await mongoDbserviceChatRoom.getSingleDocumentByQuery({
      $or: [
        {
          userId: req.user._id,
          opuser: { $in: [id.toString()] },
          type: "o2o"
          ,
        },
        {
          userId: id,
          opuser: { $in: [req.user._id.toString()] },
          type: "o2o"
        },
      ],
    })
    let room
    if (chatRoom) {
      room = chatRoom._id
    } else {
      room = ""
    }

    return message.successResponse(
      responceCode.success,
      { ...user._doc, superLike: superLike, chatRoom: room, isBlock: isBlock }
    );
  } catch (error) {
    console.log('error: ', error);
    return message.failureResponse(
      responceCode.internalServerError,
      error
    );
  }
};

exports.getDeleteUser = async (req) => {
  try {
    let query = {}
    let pageNumber = parseInt(req.body.pageNumber);
    let pageSize = parseInt(req.body.pageSize);
    let totalCount = await mongoDbserviceUserDelete.getCountDocumentByQuery(query);

    let data = await mongoDbserviceUserDelete.getDocumentByQueryPopulate(query, [], [], pageNumber, pageSize)
    let meta = {
      pageNumber: pageNumber ? pageNumber : 1,
      pageSize: pageSize ? pageSize : totalCount,
      totalCount: totalCount,
      prevPage: pageNumber ? pageNumber == 1 ? false : true : false,
      nextPage: totalCount / pageSize <= pageNumber ? false : true,
      totalPages: pageNumber && pageSize ? Math.ceil(totalCount / pageSize) : 1
    };
    return message.successResponsewithMeta(
      responceCode.success, data, meta
    )

  } catch (err) {
    console.log('err: ', err);
    return message.failureResponse(
      responceCode.internalServerError
    )
  }
}

exports.getFeedback = async (req) => {
  try {
    let query = {}
    let getGroup = await mongoDbServiceFeedback.getDocumentByQueryPopulate({})
    return message.successResponse(
      responceCode.success, getGroup
    )
  } catch (err) {
    console.log('err: ', err);
    return message.failureResponse(
      responceCode.internalServerError
    )
  }
}

exports.getSurvey = async (req) => {
  try {
    let query = {}
    let getGroup = await mongoDbServiceSurvey.getDocumentByQueryPopulate({})
    return message.successResponse(
      responceCode.success, getGroup
    )
  } catch (err) {
    console.log('err: ', err);
    return message.failureResponse(
      responceCode.internalServerError
    )
  }
}

