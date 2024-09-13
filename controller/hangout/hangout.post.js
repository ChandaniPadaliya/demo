const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages")
const { Hangout } = require("../../models/hangout.model")
const { User } = require("../../models/user.model")
const { Notification } = require("../../models/notification.model")
const mongoDbServiceHangout = require("../../services/mongoDbService")({ model: Hangout })
const mongoDbServiceUser = require("../../services/mongoDbService")({ model: User })
const mongoDbServiceNotification = require("../../services/mongoDbService")({ model: Notification })
const gcm = require("node-gcm");

exports.hangoutCreate = async (req) => {
    try {
        let { image, details, addLink, selectDate, selectTime, lat, long, invitBy, eventLink, date, address, isPublic } = req.body

        let createHangout = {
            image,
            details,
            addLink,
            selectDate,
            selectTime,
            date,
            selectLocation: {
                type: "Point",
                coordinates: [long, lat]
            },
            invitBy,
            eventLink,
            admin: req.user._id,
            address,
            isPublic
        }

        await mongoDbServiceHangout.createDocument(createHangout)
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

exports.cancel = async (req) => {
    try {
        let { id } = req.params


        let data = await mongoDbServiceHangout.getDocumentById(id)
        if (!data) {
            return message.inValidParam(
                responceCode.notFound
            );
        }
        let dataget = await mongoDbServiceNotification.getSingleDocumentByQuery({ hangout: id })

        await mongoDbServiceNotification.deleteDocument(dataget._id)
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

exports.reject = async (req) => {
    try {
        let { id } = req.params
        let dataget = await mongoDbServiceNotification.getSingleDocumentById(id)
        let data = await mongoDbServiceHangout.getDocumentById(dataget.hangout)
        if (!data) {
            return message.inValidParam(
                responceCode.notFound
            );
        }

        dataget = dataget.toJSON()
        dataget.type = "cancel"


        await mongoDbServiceNotification.findOneAndUpdateDocument({ _id: id }, dataget, { new: true })

        let getUser = await mongoDbServiceUser.getSingleDocumentByQuery({ _id: dataget.user, isNotification: true })
        if (getUser) {
            const messages = new gcm.Message({
                to: "device",
                notification: {
                    title: "hangout request reject",
                    body: "reject",
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
                    registrationTokens: [getUser.deviceToken]
                },
                function (err, res) {
                    if (err) {
                        console.log("notication err     ios :>> ", err);
                    }

                }
            )
        }
        return message.successResponse(
            responceCode.success, "success"
        )
    } catch (err) {
        console.log('err: ', err);
        return message.failureResponse(
            responceCode.internalServerError
        )
    }
}

exports.joinEvent = async (req) => {
    try {
        let { id } = req.params
        let isJoin = []
        let getEvent = await mongoDbServiceNotification.getSingleDocumentById(id)
        if (!getEvent) {
            return message.invalidRequest(
                responceCode.validationError,
                "invalid event id"
            )
        }

        let userget = await mongoDbServiceHangout.getSingleDocumentById(getEvent.hangout)
        // let userget = await mongoDbServiceUser.getSingleDocumentByQuery({ _id: req.user._id })
        isJoin = userget.member


        if (isJoin.includes(getEvent.user.toString())) {
            return message.successResponse(
                responceCode.success, userget
            )
        } else {
            isJoin.push(getEvent.user)
            userget = userget.toJSON()
            userget.member = isJoin

            let updateEvent = await mongoDbServiceHangout.findOneAndUpdateDocument({ _id: userget._id }, userget, { new: true })
            let dataget = await mongoDbServiceNotification.getSingleDocumentById(id)

            dataget = dataget.toJSON()
            dataget.type = "approved"


            await mongoDbServiceNotification.findOneAndUpdateDocument({ _id: dataget._id }, dataget, { new: true })
            let getUser = await mongoDbServiceUser.getSingleDocumentByQuery({ _id: getEvent.user, isNotification: true })
            if (getUser) {
                const messages = new gcm.Message({
                    to: "device",
                    notification: {
                        title: "hangout request approved",
                        body: "approved",
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
                        registrationTokens: [getUser.deviceToken]
                    },
                    function (err, res) {
                        if (err) {
                            console.log("notication err     ios :>> ", err);
                        }

                    }
                )
            }
            return message.successResponse(
                responceCode.success, updateEvent
            )
        }

    } catch (err) {
        console.log('err: ', err);
        return message.failureResponse(
            responceCode.internalServerError
        )
    }
}

exports.remove = async (req, res) => {
    try {
        let { member, hangout } = req.query

        let isFollow = []

        let userFind = await mongoDbServiceHangout.getSingleDocumentByQuery({ _id: hangout, $or: [{ admin: req.user._id }, { $and: [{ member: { $in: [member] } }, { $eq: member }] }] })
        if (!userFind) {
            return message.inValidParam(
                responceCode.validationError,
                "please contacts admin"
            );
        }
        isFollow = userFind.member
        if (isFollow.includes(member)) {
            const idfind = (ele) => ele == member
            let index = isFollow.findIndex(idfind)
            isFollow.splice(index, 1)

            userFind = await mongoDbServiceHangout.findOneAndUpdateDocument({ _id: hangout }, userFind, { new: true })
            let dataget = await mongoDbServiceNotification.getSingleDocumentByQuery({ hangout: hangout })

            dataget = dataget.toJSON()
            dataget.type = "remove"


            let getUser = await mongoDbServiceUser.getSingleDocumentByQuery({ _id: member, isNotification: true })
            if (getUser) {
                const messages = new gcm.Message({
                    to: "device",
                    notification: {
                        title: "hangout remove",
                        body: "remove",
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
                        registrationTokens: [getUser.deviceToken]
                    },
                    function (err, res) {
                        if (err) {
                            console.log("notication err     ios :>> ", err);
                        }

                    }
                )
            }
            await mongoDbServiceNotification.findOneAndUpdateDocument({ _id: dataget._id }, dataget, { new: true })
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

exports.joinrequest = async (req) => {
    try {
        let { id } = req.params
        let data = await mongoDbServiceHangout.getSingleDocumentById(id)
        if (!data) {
            return message.inValidParam(
                responceCode.validationError,
                "please enter valid id"
            );
        }
        let getNotification = await mongoDbServiceNotification.getSingleDocumentByQuery({ hangout: id, user: req.user._id, admin: data.admin, type: "req" })
        if (getNotification) {
            return message.inValidParam(
                responceCode.validationError,
                "You have already requested for joining this hangout"
            )
        }

        let create = {
            hangout: id,
            user: req.user._id,
            admin: data.admin,
            type: "req",
        }
        await mongoDbServiceNotification.createDocument(create)
        let getUser = await mongoDbServiceUser.getSingleDocumentByQuery({ _id: data.admin, isNotification: true })
        if (getUser) {
            const messages = new gcm.Message({
                to: "device",
                notification: {
                    title: "hangout request",
                    body: "join",
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
                    registrationTokens: [getUser.deviceToken]
                },
                function (err, res) {
                    if (err) {
                        console.log("notication err     ios :>> ", err);
                    }

                }
            )
        }
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
