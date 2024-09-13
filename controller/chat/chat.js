const httpStatus = require("http-status");
const { Chat } = require("../../models/chat/chat.model");
const { ChatRoom } = require("../../models/chat/room.model");
const { User } = require("../../models/user.model");
const message = require("../../utils/messages")
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Group } = require("../../models/group.model");
const { lastSeen } = require("../../models/lastSeen.model");
const mongoDbserviceUser = require("../../services/mongoDbService")({ model: User })
const mongoDbserviceChatRoom = require("../../services/mongoDbService")({ model: ChatRoom })
const mongoDbserviceChat = require("../../services/mongoDbService")({ model: Chat })
const mongoDbServiceGroup = require("../../services/mongoDbService")({ model: Group })
const mongoDbServiceLastSeen = require("../../services/mongoDbService")({ model: lastSeen })
const gcm = require("node-gcm");

exports.getAllUserList = () => {
    return new Promise(async (resolve, reject) => {
        let userIds = await User.find().select(["_id"]);
        userIds = userIds.map(item => {
            return item._id;
        });
        if (userIds.length > 0) {
            resolve(userIds);
        } else {
            resolve([]);
        }
    });
};

exports.getAllChatRoom = async (req, res) => {
    try {
        const roomId = req.body.roomId;

        const opuserId = req.body.opuser
        const userId = req.body.userId;
        const pagesize = req.body.pagesize;
        const pagenumber = req.body.pagenumber;
        let res = []
        let total = await Chat.countDocuments({
            roomId,
            // isDeleted: { $nin: [userId] },
        });
        let show = false


        let rese = await mongoDbserviceChat.getDocumentByQueryPopulate({ roomId }, [], [], pagenumber, pagesize, { createdAt: -1 })


        // if (req.type == "group") {
        //     let rese1 = await mongoDbserviceChatRoom.getSingleDocumentByQuery({ _id: roomId })
        //     let groupdata = await mongoDbServiceGroup.getSingleDocumentByQueryPopulate({ _id: rese1.groupId }, [], [{
        //         path: "member",
        //         select: "_id fullName address profile  birthDate  about profession gender email age"
        //     }, {
        //         path: "admin",
        //         select: "_id fullName address profile  birthDate  about profession gender email age"
        //     }])
        //     let member = []

        //     for (const ele of groupdata.member) {
        //         member.push(ele)
        //     }
        //     member.push(groupdata.admin)

        //     for (const ele of rese) {
        //         if (ele.sender != userId) {
        //             let userAdd = []
        //             userAdd.push(userId)
        //             await mongoDbserviceChat.findOneAndUpdateDocument(
        //                 { _id: ele._id },
        //                 { isRead: true, readBy: userAdd },
        //                 { new: true }
        //             );
        //             ele.isRead = true;
        //             ele.readBy = userAdd;
        //         }


        //         res.push({ ...ele._doc, isShow: show })
        //     }

        //     resolve({ res, member: member, total: total, currentcount: res.length, reqBy: req.userId });
        // }
        // if (req.type == "o2o") {
        for (const ele of rese) {
            if (ele.sender != userId) {
                let userAdd = []
                userAdd.push(userId)
                await mongoDbserviceChat.findOneAndUpdateDocument(
                    { _id: ele._id },
                    { isRead: true, readBy: userAdd },
                    { new: true }
                );
                ele.isRead = true;
                ele.readBy = userAdd;
            }

            res.push({ ...ele._doc })

        }

        return message.successResponse(
            responceCode.success, res//, total: total, currentcount: res.length, reqBy: req.userId }
        )
    } catch (error) {
        return res.status(500).json({
            status: httpStatus.INTERNAL_SERVER_ERRORINTERNAL_SERVER_ERROR,
            message: error.message || "somthing went to wrong",
        });
    }
};

exports.getRoomUpdate = async (req, res) => {
    try {


        return res.status(200).json({
            status: httpStatus.OK,
            message: "chatroom get successfull",
        });
    } catch (err) {
        return res.status(500).json({
            status: httpStatus.INTERNAL_SERVER_ERRORINTERNAL_SERVER_ERROR,
            message: err.message || "somthing went to wrong",
        });
    }
}

exports.initiateChat = async (req, res) => {
    try {
        let { opuser, groupName, image, isPublic, type, groupId } = req.body;
        let userId = req.user._id;
        // if (opuser == userId)
        //     return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
        //         states: httpStatus.UNPROCESSABLE_ENTITY,
        //         message: "somthing wrong",
        //     });
        if (type == "group") {
            let chatroom = {
                userId: req.user._id,
                groupName,
                image,
                isPublic,
                type,
                groupId
            };
            let create = await mongoDbserviceChatRoom.createDocument(chatroom)
            const response = await mongoDbserviceChatRoom.getSingleDocumentByQueryPopulate({ _id: create._id }, [], [{ path: "userId" }])

            let GroupUpdate = await mongoDbServiceGroup.getSingleDocumentById(groupId)
            GroupUpdate = GroupUpdate.toJSON()
            GroupUpdate.roomId = response._id
            await mongoDbServiceGroup.findOneAndUpdateDocument({ _id: GroupUpdate._id }, GroupUpdate, { new: true })

            return res.status(200).json({
                states: httpStatus.OK,
                message: "Chats initiated successfully",
                data: response,
            });
        }
        if (type == "AI") {

            let chatroom = {
                userId: req.user._id,
                isAI: true,
                type: "AI"
            };
            let create = await mongoDbserviceChatRoom.createDocument(chatroom)
            const response = await mongoDbserviceChatRoom.getSingleDocumentByQueryPopulate({ _id: create._id }, [], [{ path: "userId" }])
            return res.status(200).json({
                states: httpStatus.OK,
                message: "Chats initiated successfully",
                data: response,
            });
        }




        let query = {
            $or: [
                {
                    userId,
                    opuser: { $in: [opuser.toString()] },
                    type: "o2o"
                },
                {
                    userId: opuser,
                    opuser: { $in: [userId.toString()] },
                    type: "o2o"
                },
            ],
        };

        const response = await ChatRoom.findOne(query)
            .populate("opuser")
            .populate("userId")
            .sort({
                updatedAt: 1,
            });

        if (response && Object.keys(response).length) {
            return res.status(httpStatus.OK).json({
                states: httpStatus.OK,
                message: "chats initiated successfull",
                data: response,
            });
        } else {
            let chatroom = {
                userId: req.user._id,
                opuser: [req.body.opuser],
                groupName,
                image,
                isPublic,
                type
            };
            await mongoDbserviceChatRoom.createDocument(chatroom)

            const response = await mongoDbserviceChatRoom.getSingleDocumentByQueryPopulate(query, [], [{ path: "opuser" }, { path: "userId" }])
            let lastSeen = {
                room: response._id,
                user: req.user._id,
                user2: req.body.opuser,
                user1Time: 0,
                user2Time: 0
            }

            await mongoDbServiceLastSeen.createDocument(lastSeen)
            return res.status(200).json({
                states: httpStatus.OK,
                message: "Chats initiated successfully",
                data: response,
            });

        }
    } catch (error) {
        return res.status(503).json({
            states: httpStatus.SERVICE_UNAVAILABLE,
            message: error.message || "Error to initate",
        });
    }
};

exports.sendMessage = async (req, res) => {
    try {

        let chatBody = "";
        const files = req.files;
        if (files.length > 0) {
            let result = await Promise.all(files.map((a) => uploader(a)));
            chatBody = {
                attach: result,
                roomId: req.body.roomId,
                sender: req.body.sender,
                messageType: req.body.messageType,
            };
        }
        const chatroom = new Chat(chatBody);
        await chatroom
            .save()
            .then((result) => {
                return res.status(200).json({
                    starus: httpStatus.OK,
                    message: "message sent successfull",
                    data: result,
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    status: httpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message || "somthing went to wrong",
                });
            });
    } catch (error) {
        return res.status(500).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: error.message || "somthing went to wrong",
        });
    }
};

exports.allMessages = async (req, res) => {
    try {
        const { pagenumber, pagesize } = req.query;
        let total = await Chat.find();
        Chat.find()
            .skip((parseInt(pagenumber) - 1) * parseInt(pagesize))
            .limit(parseInt(pagesize))
            .then((result) => {
                result = JSON.parse(JSON.stringify(result));
                return res.status(200).json({
                    starus: httpStatus.OK,
                    message: "message sent successfull",
                    total,
                    currentcount: result.length,
                    count: result.length,
                    data: result,
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    status: httpStatus.INTERNAL_SERVER_ERROR,
                    message: err.message || "somthing went wrong",
                });
            });
    } catch (error) {
        return res.status(500).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: error.message || "somthing went wrong",
        });
    }
};

exports.msgByRoom = async (req, res) => {
    try {
        const { roomId } = req.body;
        const { pagenumber, pagesize } = req.query;
        let total = await Chat.find({ roomId });
        await Chat.find({ roomId })
            .skip((parseInt(pagenumber) - 1) * parseInt(pagesize))
            .limit(parseInt(pagesize))
            .then((result) => {
                result = JSON.parse(JSON.stringify(result));
                return res.status(httpStatus.OK).json({
                    starus: httpStatus.OK,
                    message: "message sent successfull",
                    total,
                    currentcount: result.length,
                    count: result.length,
                    data: result,
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    status: httpStatus.INTERNAL_SERVER_ERROR,
                    message: err.message || "somthing went wrong",
                });
            });
    } catch (error) {
        return res.status(500).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: error.message || "somthing went wrong",
        });
    }
};

exports.getRoomByUser = (req) => {
    return new Promise(async (resolve) => {
        console.log("-=-=-=--=p-= Room Get =-=-=-=-=-=-=-=-=");
        let user = req.userId;

        let pagenumber = req.pagenumber;
        let pagesize = req.pagesize;
        let param = { $or: [{ userId: user }, { opuser: { $in: [user] } }] };
        let total = await ChatRoom.find(param);
        let populate = [{ path: "opuser", select: "_id fullName address profile  lifestyle birthDate  about profession gender email age" }, { path: "userId", select: "_id fullName address profile  lifestyle birthDate  about profession gender email age" }]

        const chatrooms = await mongoDbserviceChatRoom.getDocumentByQueryPopulate(param, [], populate, pagenumber, pagesize, { updatedAt: -1 })

        let datas = []; let follow = true; let blocks = false; let mute = false
        for (const ele of chatrooms) {
            let count = 0;
            let unreadChat = await Chat.find({
                roomId: ele._id,
                block: { $nin: [user] }
            });
            for (const a of unreadChat) {
                if (a.sender != user) {

                    if ((a.isRead == false) && (!a.block.includes(a.sender)) && (!a.readBy.includes(req.userId))) {
                        count++;
                    }
                }
            }
            let b = [], c = []
            b.push(ele.userId._id,)
            for (const ee of ele.opuser) {
                b.push(ee._id)
            }
            let users = await mongoDbserviceUser.getSingleDocumentById(user)


            if (ele.type == "o2o") {

                if ((users.block.includes(ele.userId._id.toString()))) {
                    blocks = true
                    ele.latestmessage = {
                        message: "",
                        sender: ele.latestmessage.sender,
                        messageType: ele.latestmessage.messageType,
                        createdAt: ele.latestmessage.createdAt,
                    };

                } else {
                    blocks = false
                }

            } else {
                blocks = false
            }

            datas.push({
                ...ele._doc,
                unReadMessage: count,

                isBlock: blocks,
            });
        }
        resolve({ datas, total: total.length, currentcount: datas.length });
    });
};

exports.getByRoom = (req) => {
    return new Promise(async (resolve) => {
        const roomId = req.roomId;

        const opuserId = req.opuser
        const userId = req.userId;
        const pagesize = req.pagesize;
        const pagenumber = req.pagenumber;
        const type = req.type;
        let res = []
        let show = false
        let total = await mongoDbserviceChat.countDocument({ roomId })
        let datagetChat = await mongoDbserviceChat.getDocumentByQueryPopulate({ roomId }, [], [], pagenumber, pagesize, { createdAt: -1 })

        if (type == "o2o") {
            for (const ele of datagetChat) {
                if (ele.sender != userId) {
                    let userAdd = []
                    userAdd.push(userId)
                    await mongoDbserviceChat.findOneAndUpdateDocument(
                        { _id: ele._id },
                        { isRead: true, readBy: userAdd },
                        { new: true }
                    );
                    ele.isRead = true;
                    ele.readBy = userAdd;
                }
                res.push({ ...ele._doc, isShow: show })
            }


            let userTimeGet = await mongoDbServiceLastSeen.getSingleDocumentByQuery({ user: req.userId, room: roomId })
            if (userTimeGet) {
                userTimeGet = userTimeGet.toJSON()
                userTimeGet.user1Time = new Date().getTime()
                await mongoDbServiceLastSeen.findOneAndUpdateDocument({ _id: userTimeGet._id }, userTimeGet, { new: true })
            } else {
                let userTimeGet2 = await mongoDbServiceLastSeen.getSingleDocumentByQuery({ user1: req.userId, room: roomId })
                if (userTimeGet2) {
                    userTimeGet2 = userTimeGet2.toJSON()
                    userTimeGet2.user2Time = new Date().getTime()

                    await mongoDbServiceLastSeen.findOneAndUpdateDocument({ _id: userTimeGet2._id }, userTimeGet2, { new: true })
                }
            }
            resolve({ res, total: total, currentcount: res.length, reqBy: req.userId });
        }

        if (type == "group") {
            let rese1 = await mongoDbserviceChatRoom.getSingleDocumentByQueryPopulate({ _id: roomId }, ["removeUser", "groupId"], [{
                path: "removeUser",
                select: "_id fullName address profile  birthDate  about profession gender email age"
            }])
            let groupdata = await mongoDbServiceGroup.getSingleDocumentByQueryPopulate({ _id: rese1.groupId }, [], [{
                path: "member",
                select: "_id fullName address profile  birthDate  about profession gender email age"
            }, {
                path: "admin",
                select: "_id fullName address profile  birthDate  about profession gender email age"
            }])
            let member = []
            if (groupdata.member != null) {
                for (const ele of groupdata.member) {
                    member.push(ele)
                }
            }
            let removeUser = []
            if (rese1.removeUser != null) {
                for (const ele of rese1.removeUser) {
                    member.push(ele)
                    removeUser.push(ele._id.toString())
                }
            }
            member.push(groupdata.admin)

            for (const ele of datagetChat) {
                if (ele.sender != userId) {
                    let userAdd = []
                    userAdd.push(userId)
                    await mongoDbserviceChat.findOneAndUpdateDocument(
                        { _id: ele._id },
                        { isRead: true, readBy: userAdd },
                        { new: true }
                    );
                    ele.isRead = true;
                    ele.readBy = userAdd;
                }


                res.push({ ...ele._doc, isShow: show })
            }

            resolve({ res, member: member, removeUser: removeUser, total: total, currentcount: res.length, reqBy: req.userId });
        }

        if (type == "AI") {
            for (const ele of datagetChat) {
                if (ele.isAI == true) {
                    let userAdd = []
                    userAdd.push(userId)
                    await mongoDbserviceChat.findOneAndUpdateDocument(
                        { _id: ele._id },
                        { isRead: true, readBy: userAdd },
                        { new: true }
                    );
                    ele.isRead = true;
                    ele.readBy = userAdd;
                }
                res.push({ ...ele._doc, isShow: show })
            }

            resolve({ res, total: total, currentcount: res.length, reqBy: req.userId });
        }
    });
};

exports.AIChat = (req) => {
    return new Promise(async (resolve) => {
        let message = req.message;
        let roomId = req.roomId;
        let userId = req.userId;
        let messageType = "text"
        const genAI = new GoogleGenerativeAI("AIzaSyCd1OTF647seXVlVt0IHewumm3w8kIsKHw");


        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = "Write a story about a magic backpack."

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        let latestmessage = {};


        latestmessage = {
            message: text,
            messageType: "text",
            isAI: true,
            createdAt: new Date().getTime(),
        };
        await ChatRoom.findByIdAndUpdate(roomId, { latestmessage, isMagessge: true }, { new: true });
        let chat = {
            message: text,
            roomId: roomId,
            isAI: true,
            messageType: "text",
            readBy: [userId],
            block: []
        };
        chat.createdAt = new Date().getTime();
        let chatDatas = await mongoDbserviceChat.createDocument(chat);
        console.log(text);
        let chatObjectAI = await Chat.findOne({ _id: chatDatas._id });//.populate(populateForReturnData)
        return resolve(chatObjectAI)
    })
}

exports.AI = (req) => {
    return new Promise(async (resolve) => {
        let latestmessage = {};

        latestmessage = {
            message: req.message,
            messageType: "text",
            isAI: false,
            createdAt: new Date().getTime(),
        };
        await ChatRoom.findByIdAndUpdate(req.roomId, { latestmessage, isMagessge: true }, { new: true });

        let chat = {
            message: req.message,
            roomId: req.roomId,
            isAI: false,
            messageType: "text",
            readBy: [req.userId],
            block: []
        };
        chat.createdAt = new Date().getTime();
        let chatData = await mongoDbserviceChat.createDocument(chat);

        chatData.save()
        chatData = chatData.toJSON();

        let chatObject = await Chat.findOne({ _id: chatData._id });//.populate(populateForReturnData)
        // AIChat(chatObject.message, chatObject.roomId, chatObject.readBy[0], chatObject.messageType)
        return resolve(chatObject)


    })
}


exports.add = (req) => {
    return new Promise(async (resolve) => {
        let latestmessage = {};
        if (req.messageType == "text" || req.messageType == "text/image") {
            latestmessage = {
                message: req.message,
                sender: req.sender,
                messageType: req.messageType,
                createdAt: new Date().getTime(),
            };
        } else {
            latestmessage = {
                message: "",
                sender: req.sender,
                messageType: req.messageType,
                createdAt: new Date().getTime(),
            };
        }

        await ChatRoom.findByIdAndUpdate(req.roomId, { latestmessage, isMagessge: true }, { new: true });


        let chat = {};

        let abc = []

        if (req.messageType == "text") {
            chat = {
                message: req.message,
                roomId: req.roomId,
                sender: req.sender,
                messageType: req.messageType,
                readBy: req.readBy,
                block: abc
            };
        }
        else if (req.messageType == "image" || req.messageType == "video" || req.messageType == "document" || req.messageType == "audio") {
            chat = {
                message: req.message,
                mediaName: req.mediaName,
                roomId: req.roomId,
                sender: req.sender,
                messageType: req.messageType,
                readBy: req.readBy,
                block: abc
            };
        }
        else if (req.messageType == "text/image") {
            chat = {
                message: req.message,
                mediaName: req.mediaName,
                message: req.message,
                roomId: req.roomId,
                sender: req.sender,
                messageType: req.messageType,
                readBy: req.readBy,
                block: abc
            };
        }

        chat.createdAt = new Date().getTime();
        let chatData = new Chat(chat);

        chatData.save()
        chatData = chatData.toJSON();

        let rooms = await ChatRoom.findOne({ _id: chatData.roomId, isDeleted: false },);

        let chatObject = await Chat.findOne({ _id: chatData._id });

        let userAdd = []
        userAdd.push(req.sender)

        if (req.type == "o2o") {
            let find = await mongoDbserviceUser.getSingleDocumentByQuery({ _id: req.userId })
            if ((find.block.includes(req.sender.toString()))) {
                chatObject = chatObject.toJSON()
                chatObject.isRead = true
                chatObject.readBy = userAdd
                return resolve(chatObject)
            }

            if (rooms.isNotification.includes(req.userId.toString())) {
                let userAdd2 = []
                for (const ele of rooms.opuser) {
                    userAdd2.push(req.sender, ele)
                }
                chatObject = chatObject.toJSON()
                chatObject.isRead = true
                chatObject.readBy = userAdd
                return resolve(chatObject)
            }
            else {
                let device = []

                let user = await mongoDbserviceUser.getSingleDocumentByQuery({ _id: req.userId, isNotification: true })
                device.push(user.deviceToken)

                let sender = await mongoDbserviceUser.getSingleDocumentByQuery({ _id: req.sender.toString() });
                let body
                let title = sender.fullName

                if (chatData.messageType == "audio") {
                    body = "Sent an audio 🎤"
                }
                if (chatData.messageType == "document") {
                    body = "Sent an document 📃"
                }
                if (chatData.messageType == "video") {
                    body = "Sent an video 📸"
                }
                if (chatData.messageType == "image") {
                    body = "Sent an image 📷"
                }
                if (chatData.messageType == "text") {

                    body = chatData.message
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
                        type: "",
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
                        if (err) {
                            console.log("notication err     ios :>> ", err);
                        }

                    }
                )
                return resolve(chatObject)
            }
        }

        if (req.type == "group") {

            let userAdd2 = []
            let deviceUser
            for (const ele of rooms.opuser) {
                // userAdd2.push(req.sender, ele)
                if ((!rooms.isNotification.includes(ele.toString()))) {
                    userAdd2.push(ele)
                }
                if (!rooms.isNotification.includes(rooms.userId.toString())) {
                    userAdd2.push(rooms.userId)
                }

                deviceUser = [...new Set(userAdd2)]

            }

            let device = []
            if (deviceUser.length == 0) {
                let userAdd = []
                chatObject = chatObject.toJSON()
                chatObject.isRead = true
                chatObject.readBy = userAdd
                return resolve(chatObject)
            }
            for (const ele of deviceUser) {

                let user = await mongoDbserviceUser.getSingleDocumentByQuery({ _id: ele, isNotification: true })
                device.push(user.deviceToken)
            }
            let senderGroup = await mongoDbserviceUser.getSingleDocumentByQuery({ _id: req.sender.toString() });

            let title = rooms.groupName


            let body
            if (chatData.messageType == "audio") {
                body = senderGroup.fullName + ": " + "Sent an audio 🎤"
            }
            if (chatData.messageType == "document") {
                body = senderGroup.fullName + ": " + "Sent an document 📃"
            }
            if (chatData.messageType == "video") {
                body = senderGroup.fullName + ": " + "Sent an video 📸"
            }
            if (chatData.messageType == "image") {
                body = senderGroup.fullName + ": " + "Sent an image 📷"
            }
            if (chatData.messageType == "text") {

                body = senderGroup.fullName + ": " + chatData.message
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
                    type: "",
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
                    if (err) {
                        console.log("notication err     ios :>> ", err);
                    }

                }
            )
            return resolve(chatObject)
        }
    })
}

exports.updateRoom = async (req, res) => {
    try {
        let { roomId, userId, isNot } = req.body

        let isFollow = []
        let getAllChat = await mongoDbserviceChatRoom.getSingleDocumentById(roomId)

        isFollow = getAllChat.isNotification
        if (isNot == true) {
            const idfind = (ele) => ele == userId
            let index = isFollow.findIndex(idfind)
            isFollow.splice(index, 1)
            let a = await mongoDbserviceChatRoom.findOneAndUpdateDocument({ _id: getAllChat._id }, getAllChat, { new: true })

            return res.status(200).json({
                status: httpStatus.OK,
                message: a,

            });
        } else if (!isFollow.includes(userId)) {
            isFollow.push(userId)
            getAllChat = getAllChat.toJSON()
            getAllChat.isNotification = isFollow
            let b = await mongoDbserviceChatRoom.findOneAndUpdateDocument({ _id: getAllChat._id }, getAllChat, { new: true })

            return res.status(200).json({
                status: httpStatus.OK,
                message: b
            });
        }
    } catch (err) {
        console.log('err: ', err);

    }
}

exports.editMessage = (req) => {
    return new Promise(async (resolve) => {
        let chatroom = Chat.findByIdAndUpdate(req.messageId, {
            $set: {
                roomId,
                sender,
                message,
            },
        });
        resolve(chatroom);
    });
};

exports.delete = async (req, res) => {
    console.log("================DELETE-Chat====================");
    return new Promise(async (resolve) => {

        req.chatId
        let isDeleted = []
        let chatroom
        for (const ele of req.chatId) {

            chatroom = await mongoDbserviceChat.getSingleDocumentById(ele);
            if (chatroom) {
                isDeleted.push(req.userId)
                await mongoDbserviceChat.findOneAndUpdateDocument({ _id: ele }, { isDeleted }, { new: true })
            }
        }

        let latestmessage = await mongoDbserviceChat.getDocumentByQuery({ roomId: chatroom.roomId })

        return resolve(latestmessage)
    })
}

exports.deleteFromRoom = async (req, res) => {
    return new Promise(async (resolve) => {
        console.log('---------------deleteFromRoom: ----------');
        if (req.type == "AI") {

            const getAllChat = await mongoDbserviceChat.getDocumentByQuery({ roomId: req.roomId });
            for (const ele of getAllChat) {

                await mongoDbserviceChat.findOneAndDeleteDocument({ _id: ele._id }, { new: true });

            }
            let latestmessage = await mongoDbserviceChat.getDocumentByQuery({ roomId: req.roomId })
            await ChatRoom.findByIdAndUpdate(req.roomId,
                {
                    latestmessage: {
                        message: "",
                        sender: "",
                        messageType: "",
                        createdAt: new Date().getTime(),
                    }
                }
                , { new: true });
            return resolve(latestmessage)

        }

        const getAllChat = await mongoDbserviceChat.getDocumentByQuery({ roomId: req.roomId });
        let isFollow = []
        for (const ele of getAllChat) {
            isFollow = ele.isDeleted

            let ChatDate = await mongoDbserviceChat.getSingleDocumentByQuery({ _id: ele._id });
            isFollow.push(req.userId)
            ChatDate = ChatDate.toJSON();
            ChatDate.isDeleted = isFollow
            await mongoDbserviceChat.findOneAndUpdateDocument({ _id: ele._id }, ChatDate, { new: true })

        }
        let latestmessage = await mongoDbserviceChat.getDocumentByQuery({ roomId: req.roomId })

        return resolve(latestmessage)

    })
};

exports.typing = (req) => {
    return new Promise(async (resolve, reject) => {
        let chat = {
            roomId: req.roomId,
            userId: req.userId,
            isTyping: req.isTyping,
            // opuser: req.opuser,
        };
        resolve(chat);

    });
};

exports.call = (req) => {
    return new Promise(async (resolve, reject) => {
        console.log(123);
        let chat = {
            name: req.name,
            image: req.image,
            roomId: req.roomId,
            userId: req.userId,
            type: req.type,
            opuser: req.opuser,
        };


        latestmessage = {
            message: "",
            sender: req.sender,
            messageType: req.messageType,
            createdAt: new Date().getTime(),
        };
        await ChatRoom.findByIdAndUpdate(req.roomId, { latestmessage }, { new: true });

        resolve(chat);

    });
};

exports.callstatus = (req) => {
    return new Promise(async (resolve, reject) => {
        console.log(123);
        let chat = {

            roomId: req.roomId,
            userId: req.userId,
            status: req.status,
            opuser: req.opuser
        };


        latestmessage = {
            message: "",
            sender: req.sender,
            messageType: req.messageType,
            createdAt: new Date().getTime(),
        };
        await ChatRoom.findByIdAndUpdate(req.roomId, { latestmessage }, { new: true });

        resolve(chat);

    });
};

exports.online = (req) => {
    return new Promise(async (resolve, reject) => {
        let chat = {
            roomId: req.roomId,
            userId: req.userId,
            isOnline: req.isOnline,
            // opuser: req.opuser,
        };
        resolve(chat);

    });
};

exports.isread = (req) => {
    return new Promise(async (resolve, reject) => {
        let chat = await mongoDbserviceChat.getDocumentByQuery({ roomId: req.roomId })
        for (const ele of chat) {
            if (ele.sender != req.userId) {
                ele.isRead = true
                let a = await mongoDbserviceChat.findOneAndUpdateDocument(
                    { _id: ele._id },
                    { isRead: true },
                    { new: true }
                );
            }
        }
        resolve(chat);
    });
};

exports.isArchived = async (req, res) => {
    try {
        const { user, roomId } = req.body;
        let isFollow = []
        let getAllChat = await mongoDbserviceChatRoom.getSingleDocumentById(roomId)

        isFollow = getAllChat.ArchivedUser
        if (isFollow.includes(user)) {
            const idfind = (ele) => ele == user
            let index = isFollow.findIndex(idfind)
            isFollow.splice(index, 1)

            await mongoDbserviceChatRoom.findOneAndUpdateDocument({ _id: getAllChat._id }, getAllChat, { new: true })

            return res.status(200).json({
                status: httpStatus.OK,
                message: "successfully"
            });
        } else {
            isFollow.push(user)
            getAllChat = getAllChat.toJSON()
            getAllChat.ArchivedUser = user.toString()
            await mongoDbserviceChatRoom.findOneAndUpdateDocument({ _id: getAllChat._id }, getAllChat, { new: true })

            return res.status(200).json({
                status: httpStatus.OK,
                message: "successfully"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: err.message || "somthing went wrong",
        });
    }
};

exports.mute = async (req, res) => {
    try {
        const { user, roomId } = req.body;
        let isFollow = []
        let getAllChat = await mongoDbserviceChatRoom.getSingleDocumentById(roomId)

        isFollow = getAllChat.mute
        if (isFollow.includes(user)) {
            const idfind = (ele) => ele == user
            let index = isFollow.findIndex(idfind)
            isFollow.splice(index, 1)
            await mongoDbserviceChatRoom.findOneAndUpdateDocument({ _id: getAllChat._id }, getAllChat, { new: true })

            return res.status(200).json({
                status: httpStatus.OK,
                message: "successfully"
            });
        } else {
            isFollow.push(user)
            getAllChat = getAllChat.toJSON()
            getAllChat.mute = user.toString()
            await mongoDbserviceChatRoom.findOneAndUpdateDocument({ _id: getAllChat._id }, getAllChat, { new: true })

            return res.status(200).json({
                status: httpStatus.OK,
                message: "successfully"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: err.message || "somthing went wrong",
        });
    }
};

exports.getTimeUser = async (req, res) => {
    return new Promise(async (resolve, reject) => {

        let user = await mongoDbServiceLastSeen.getSingleDocumentByQuery({ room: req.roomId, user: req.user }, ["user2Time"])
        if (user) {
            resolve(user);
        }
        let user2 = await mongoDbServiceLastSeen.getSingleDocumentByQuery({ room: req.roomId, user2: req.user }, ["user1Time"])

        if (user2) {
            resolve(user2);
        }

    })
}

exports.getByRoomGroup = (req) => {
    return new Promise(async (resolve) => {
        const roomId = req.roomId;

        const userId = req.opuser;
        const pagesize = req.pagesize;
        const pagenumber = req.pagenumber;
        const type = req.type;
        let res = []
        let show = false

        let total = await mongoDbserviceChat.countDocument({ roomId })
        let datagetChat = await mongoDbserviceChat.getDocumentByQueryPopulate({ roomId }, [], [], pagenumber, pagesize, { createdAt: -1 })


        let rese1 = await mongoDbserviceChatRoom.getSingleDocumentByQueryPopulate({ _id: roomId }, ["removeUser", "groupId"], [{
            path: "removeUser",
            select: "_id fullName address profile  birthDate  about profession gender email age"
        }])
        let groupdata

        let member = [], removeUser = []
        if (rese1) {
            groupdata = await mongoDbServiceGroup.getSingleDocumentByQueryPopulate({ _id: rese1.groupId }, [], [{
                path: "member",
                select: "_id fullName address profile  birthDate  about profession gender email age"
            }, {
                path: "admin",
                select: "_id fullName address profile  birthDate  about profession gender email age"
            }])
            if (groupdata.member != null) {
                for (const ele of groupdata.member) {
                    member.push(ele)
                }
            }
            if (rese1.removeUser != null) {
                for (const ele of rese1.removeUser) {
                    member.push(ele)
                    removeUser.push(ele._id.toString())
                }
            }
            member.push(groupdata.admin)
        }
        for (const ele of datagetChat) {
            if (ele.sender != userId) {
                let userAdd = []
                await mongoDbserviceChat.findOneAndUpdateDocument(
                    { _id: ele._id },
                    { isRead: true, },
                    { new: true }
                );
                ele.isRead = true;

            }

            res.push({ ...ele._doc, isShow: show })
        }

        resolve({ res, member: member, removeUser: removeUser, total: total, currentcount: res.length, });

    });
};

exports.joinGroupChat = (req) => {
    return new Promise(async (resolve) => {

        let chat = {
            message: "add",
            roomId: req.roomId,
            sender: req.member,
            messageType: "join",
            readBy: req.opuser,
            block: []
        };
        chat.createdAt = new Date().getTime();
        let chatData = await mongoDbserviceChat.createDocument(chat);
        let chatObject = await Chat.findOne({ _id: chatData._id })
        // chatData.save(chatObject)
        resolve(chatObject)
        // }
    })
}

exports.removeGroupChat = (req) => {
    return new Promise(async (resolve) => {
        let chat = {
            message: req.member,
            roomId: req.roomId,
            sender: req.admin,
            messageType: "remove",
            readBy: req.opuser,
            block: []
        };
        chat.createdAt = new Date().getTime();
        let chatData = await mongoDbserviceChat.createDocument(chat);
        let chatObject = await Chat.findOne({ _id: chatData._id })
        resolve(chatObject)
    })
}

exports.leaveGroupChat = (req) => {
    return new Promise(async (resolve) => {
        let chat = {
            message: "leave",
            roomId: req.roomId,
            sender: req.user,
            messageType: "leave",
            readBy: req.opuser,
            block: []
        };
        chat.createdAt = new Date().getTime();
        let chatData = await mongoDbserviceChat.createDocument(chat);
        let chatObject = await Chat.findOne({ _id: chatData._id })
        resolve(chatObject)
    })
}

exports.removeChat = async (req, res) => {
    try {
        let { member, groupId } = req.query


        let userFind = await mongoDbserviceChatRoom.getSingleDocumentByQuery({ groupId: groupId, userId: req.user._id })
        if (!userFind) {
            return res.status(500).json({
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: "somthing went wrong",
            });
        }
        let isFollow, isJoin, isJoinGroup = []
        isFollow = userFind.opuser
        isJoin = userFind.removeUser
        if (isFollow.includes(member)) {
            const idfind = (ele) => ele == member
            let index = isFollow.findIndex(idfind)
            isFollow.splice(index, 1)

            userFind = await mongoDbserviceChatRoom.findOneAndUpdateDocument({ groupId: groupId }, userFind, { new: true })

            let userget = await mongoDbserviceChatRoom.getSingleDocumentByQuery({ groupId: groupId })
            if (!isJoin.includes(member.toString())) {

                isJoin.push(member)
                userget = userget.toJSON()
                userget.removeUser = isJoin
                await mongoDbserviceChatRoom.findOneAndUpdateDocument({ _id: userget._id }, userget, { new: true })

            }

            let group = await mongoDbServiceGroup.getSingleDocumentById(groupId)
            isJoinGroup = group.member
            if (isJoinGroup.includes(member.toString())) {
                const idfind = (ele) => ele == member.toString()
                let index = isFollow.findIndex(idfind)
                isJoinGroup.splice(index, 1)
            }
            let update = await mongoDbServiceGroup.findOneAndUpdateDocument({ _id: groupId }, group, { new: true })
            return res.status(200).json({
                status: httpStatus.OK,
                data: update
            });
        } else {
            return res.status(200).json({
                status: httpStatus.OK,
                message: "successfully"
            });

        }
    } catch (err) {
        console.log('err: ', err);
        return res.status(500).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: err.message || "somthing went wrong",
        });

    }
}

exports.mediaGet = async (req, res) => {
    try {
        let { id } = req.params

        let roomGet = await mongoDbserviceChatRoom.getSingleDocumentByQuery({ groupId: id })
        let getChat = await mongoDbserviceChat.getDocumentByQuery({ messageType: { $ne: "text" }, roomId: roomGet._id }, ["message", "messageType", "mediaName"])

        return res.status(200).json({
            status: httpStatus.OK,
            message: getChat
        });
    } catch (err) {
        return res.status(500).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: err.message || "somthing went wrong",
        });

    }
}

exports.leaveGroup = async (req, res) => {
    try {
        let { id } = req.params
        let userFind = await mongoDbserviceChatRoom.getSingleDocumentByQuery({ type: "group", groupId: id, userId: req.user._id })
        if (userFind) {
            let isFollow, isJoinGroup, isJoinUser = []
            isFollow = userFind.opuser

            isJoinUser.push(userFind.userId)

            userFind = userFind.toJSON()
            userFind.removeUser = isJoinUser
            userFind.userId = userFind.opuser[0]
            await mongoDbserviceChatRoom.findOneAndUpdateDocument({ _id: userFind._id }, userFind, { new: true })

            let get = await mongoDbserviceChatRoom.getSingleDocumentByQuery({ type: "group", groupId: id, })
            isFollow = get.opuser

            if (isFollow.includes(get.userId.toString())) {
                const idfind = (ele) => ele == get.userId.toString()
                let index = isFollow.findIndex(idfind)
                isFollow.splice(index, 1)
                await mongoDbserviceChatRoom.findOneAndUpdateDocument({ _id: userFind._id }, get, { new: true })
            }
            let group = await mongoDbServiceGroup.getSingleDocumentById(id)
            group = group.toJSON()
            group.admin = group.member[0]

            await mongoDbServiceGroup.findOneAndUpdateDocument({ _id: group._id }, group, { new: true })
            let groupdata = await mongoDbServiceGroup.getSingleDocumentByQuery({ _id: group._id })
            isJoinGroup = groupdata.member

            if (isJoinGroup.includes(groupdata.admin.toString())) {
                const idfind = (ele) => ele == groupdata.admin.toString()
                let index = isJoinGroup.findIndex(idfind)
                isJoinGroup.splice(index, 1)
                await mongoDbServiceGroup.findOneAndUpdateDocument({ _id: group._id }, groupdata, { new: true })
            }
            return res.status(200).json({
                status: httpStatus.OK,
                data: groupdata
            });

        }

        let userFinds = await mongoDbserviceChatRoom.getSingleDocumentByQuery({ groupId: id })
        let isJoinGroup, isFollow, isJoin = []
        isFollow = userFinds.opuser
        isJoin = userFinds.removeUser
        if (isFollow.includes(req.user._id.toString())) {
            const idfind = (ele) => ele == req.user._id.toString()
            let index = isFollow.findIndex(idfind)
            isFollow.splice(index, 1)

            userFinds = await mongoDbserviceChatRoom.findOneAndUpdateDocument({ _id: userFinds._id }, userFinds, { new: true })

            let userget = await mongoDbserviceChatRoom.getSingleDocumentByQuery({ groupId: id })
            if (!isJoin.includes(req.user._id.toString())) {

                isJoin.push(req.user._id.toString())
                userget = userget.toJSON()
                userget.removeUser = isJoin
                await mongoDbserviceChatRoom.findOneAndUpdateDocument({ _id: userget._id }, userget, { new: true })

            }
            let group = await mongoDbServiceGroup.getSingleDocumentById(id)
            isJoinGroup = group.member
            if (isJoinGroup.includes(req.user._id.toString())) {
                const idfind = (ele) => ele == req.user._id.toString()
                let index = isFollow.findIndex(idfind)
                isJoinGroup.splice(index, 1)
                await mongoDbServiceGroup.findOneAndUpdateDocument({ _id: id }, group, { new: true })
            }
            return res.status(200).json({
                status: httpStatus.OK,
                data: group
            });

        }
    } catch (err) {
        console.log('err: ', err);
        return res.status(500).json({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: err.message || "somthing went wrong",

        })
    }

    exports.history = async (req, res) => {
        try {
            const roomId = req.body.roomId;

            const opuserId = req.body.opuser
            const userId = req.body.userId;
            const pagesize = req.body.pagesize;
            const pagenumber = req.body.pagenumber;
            let res1 = []
            let total = await Chat.countDocuments({
                roomId,
            });
            let show = false


            let datagetChat = await mongoDbserviceChat.getDocumentByQueryPopulate({ roomId }, [], [], pagenumber, pagesize, { createdAt: -1 })
            if (req.type == "group") {
                let rese1 = await mongoDbserviceChatRoom.getSingleDocumentByQuery({ _id: roomId })
                let groupdata = await mongoDbServiceGroup.getSingleDocumentByQueryPopulate({ _id: rese1.groupId }, [], [{
                    path: "member",
                    select: "_id fullName address profile  birthDate  about profession gender email age"
                }, {
                    path: "admin",
                    select: "_id fullName address profile  birthDate  about profession gender email age"
                }])
                let member = []

                for (const ele of groupdata.member) {
                    member.push(ele)
                }
                member.push(groupdata.admin)

                for (const ele of rese) {
                    if (ele.sender != userId) {
                        let userAdd = []
                        userAdd.push(userId)
                        await mongoDbserviceChat.findOneAndUpdateDocument(
                            { _id: ele._id },
                            { isRead: true, readBy: userAdd },
                            { new: true }
                        );
                        ele.isRead = true;
                        ele.readBy = userAdd;
                    }


                    res.push({ ...ele._doc, isShow: show })
                }

                resolve({ res, member: member, total: total, currentcount: res.length, reqBy: req.userId });
            }
            if (req.body.type == "o2o") {
                for (const ele of datagetChat) {
                    if (ele.sender != userId) {
                        let userAdd = []
                        userAdd.push(userId)
                        await mongoDbserviceChat.findOneAndUpdateDocument(
                            { _id: ele._id },
                            { isRead: true, readBy: userAdd },
                            { new: true }
                        );
                        ele.isRead = true;
                        ele.readBy = userAdd;
                    }
                    res1.push(ele)


                    return message.successResponse(
                        responceCode.success, { res1, total: total, currentcount: res.length, admin: 1 }
                    )

                }
            }
        } catch (err) {
            console.log('err: ', err);
            return message.failureResponse(
                responceCode.internalServerError
            )
        }
    }
}