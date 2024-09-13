const { MatchUser } = require("../../models/matchUser.model")
const message = require("../../utils/messages")
const responceCode = require("../../utils/responseCode")
const mongoDbServiceMatchUser = require("../../services/mongoDbService")({ model: MatchUser })

exports.getmatch = async (req) => {
    try {
        let { user1 } = req.query
        let query = {
            $or: [
                {
                    user1,
                },
                {
                    user2: user1,
                },
            ],
        }
        let getMatch = await mongoDbServiceMatchUser.getDocumentByQueryPopulate(query, [], [{
            path: "user1",
            select: "_id fullName address profile  lifestyle birthDate  about profession gender email age lat long location"
        }, {
            path: "user2",
            select: "_id fullName address profile  lifestyle birthDate  about profession gender email age lat long location"
        },]);
        let data = []
        for (const ele of getMatch) {
            data.push({ ...ele._doc, isMatch: true })
        }
        if (!getMatch) {
            return message.successResponse(
                responceCode.success,
                [{ isMatch: false }]
            )
        }

        return message.successResponse(
            responceCode.success, data
        )
    } catch (err) {
        console.log('err: ', err);
        return message.failureResponse(
            responceCode.internalServerError
        )
    }
}
exports.getmatchOne = async (req) => {
    try {
        let { user1 } = req.query
        let query = {
            $or: [
                {
                    user1: req.user._id, user2: user1
                },
                {
                    user1,
                    user2: req.user._id,
                },
            ],
        }
        let getMatch = await mongoDbServiceMatchUser.getSingleDocumentByQueryPopulate(query, [], [{
            path: "user1",
            select: "_id fullName address profile  lifestyle birthDate  about profession gender email age"
        }, {
            path: "user2",
            select: "_id fullName address profile  lifestyle birthDate  about profession gender email age"
        },])

        if (!getMatch) {
            return message.successResponse(
                responceCode.success,
                { isMatch: false }
            )
        }

        return message.successResponse(
            responceCode.success, { ...getMatch._doc, isMatch: true }
        )
    } catch (err) {
        console.log('err: ', err);
        return message.failureResponse(
            responceCode.internalServerError
        )
    }
}