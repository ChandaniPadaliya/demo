const { MatchUser } = require("../../models/matchUser.model")
const { User } = require("../../models/user.model")
const message = require("../../utils/messages")
const responceCode = require("../../utils/responseCode")
const mongoDbServiceMatchUser = require("../../services/mongoDbService")({ model: MatchUser })
const mongoDbServiceUser = require("../../services/mongoDbService")({ model: User })
const { Like } = require("../../models/like.model");
const serviceLike = require("../../services/mongoDbService")({ model: Like });
const gcm = require("node-gcm");

exports.MatchUserCreate = async (req) => {
  try {
    let { id } = req.params

    const user1 = await mongoDbServiceUser.getSingleDocumentById(id);
    const user2 = await mongoDbServiceUser.getSingleDocumentById(req.user._id);
    if (user1._id.toString() == user2._id.toString()) {
      return message.invalidRequest(
        responceCode.badRequest,
        "user 1 and user2 same"
      )
    }
    let getUser = await mongoDbServiceMatchUser.getSingleDocumentByQuery({ $or: [{ user1: id, user2: req.user._id }, { user1: req.user._id, user2: id }] })
    if (getUser) {
      return message.successResponse(
        responceCode.success,
      )
    }

    if (!user1 || !user2) {
      return message.badRequest(
        responceCode.notFound
      )
    }

    function calculateInterestScore(interests1, interests2) {
      // Example: Calculate interest score based on common interests.
      const commonInterests = interests1.filter((interest) => interests2.includes(interest));
      return commonInterests.length / Math.max(interests1.length, interests2.length);
    }

    function calculateAgeDifferenceScore(age1, age2) {
      // Example: Calculat  e age difference score.
      const ageDifference = Math.abs(age1 - age2);
      return 1 - ageDifference / 20;                   // Assuming a maximum age difference of 10 years.
    }

    function calculateLocationScore(location1, location2) {
      // Example: Calculate location score based on proximity.
      return location1 == location2 ? 1 : 0;
    }



    // Example: Calculate a match score based on interests, age difference, and location.
    const interestScore = calculateInterestScore(user1.lifestyle, user2.lifestyle);
    const ageDifferenceScore = calculateAgeDifferenceScore(user1.age, user2.age);
    const locationScore = calculateLocationScore(user1.education, user2.education);

    // Combine scores with weights based on importance.
    const totalScore = interestScore * 0.5 + ageDifferenceScore * 0.3 + locationScore * 0.2;

    let matchuser = {
      user1,
      user2,
      matchScore: matchScore = Math.min(100, Math.floor(totalScore * 100))
    }
    let like1 = [], like2 = [], yourlike1 = [], yourlike2 = []
    let userget1 = await serviceLike.getSingleDocumentByQuery({ user: user1 })
    if (userget1) {
      like1 = userget1.like
      yourlike1 = userget1.yourLike

      if (like1.includes(user2._id.toString())) {
        const idfind = (ele) => ele == user2
        let index = like1.findIndex(idfind)
        like1.splice(index, 1)
        await serviceLike.findOneAndUpdateDocument({ user: user1 }, userget1, { new: true })
      }

      if (yourlike1.includes(user2._id.toString())) {
        const idfind = (ele) => ele == user2
        let index = yourlike1.findIndex(idfind)
        yourlike1.splice(index, 1)
        await serviceLike.findOneAndUpdateDocument({ user: user1 }, userget1, { new: true })
      }
    }
    let userget2 = await serviceLike.getSingleDocumentByQuery({ user: user2 })
    if (userget2) {
      like2 = userget2.like
      yourlike2 = userget2.yourLike
      if (like2.includes(user1._id.toString())) {
        const idfind = (ele) => ele == user1
        let index = like2.findIndex(idfind)
        like2.splice(index, 1)
        await serviceLike.findOneAndUpdateDocument({ user: user2 }, userget2, { new: true })

      }
      if (yourlike2.includes(user1._id.toString())) {
        const idfind = (ele) => ele == user1
        let index = yourlike2.findIndex(idfind)
        yourlike2.splice(index, 1)
        await serviceLike.findOneAndUpdateDocument({ user: user2 }, userget2, { new: true })
      }
    }

    const user1Device = await mongoDbServiceUser.getSingleDocumentByQuery({ _id: id, isNotification: true });
    const user2Device = await mongoDbServiceUser.getSingleDocumentByQuery({ _id: req.user._id, isNotification: true });
    if (user2Device) {
      const messages = new gcm.Message({
        to: "device",
        notification: {
          title: "match create",
          body: "match",
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
          registrationTokens: [user2Device.deviceToken]
        },
        function (err, res) {
          if (err) {
            console.log("notication err     ios :>> ", err);
          }

        }
      )
    }
    if (user1Device) {
      const messages = new gcm.Message({
        to: "device",
        notification: {
          title: "match create",
          body: "match",
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
          registrationTokens: [user1Device.deviceToken]
        },
        function (err, res) {
          if (err) {
            console.log("notication err     ios :>> ", err);
          }

        }
      )
    }
    await mongoDbServiceMatchUser.createDocument(matchuser)
    return message.successResponse(
      responceCode.success,
    )

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }

}