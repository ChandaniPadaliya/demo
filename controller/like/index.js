const sendResponse = require("../../helpers/sendResponse");

const postLike = require("./like.post");
const getLike = require("./like.get");
const updateLike = require("./like.put");

//team create
exports.create = (req, res) => {
  postLike
    .likeCreate(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};
exports.dislikecreate = (req, res) => {
  postLike
    .disLikeCreate(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};

exports.superlikeCreate = (req, res) => {
  postLike
    .superlikeCreate(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};

exports.get = (req, res) => {
  getLike
    .getlikeByUid(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};
exports.getByAdmin = (req, res) => {
  getLike
    .getlikeAll(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};
exports.update = (req, res) => {
  updateLike
    .likeupdate(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};

exports.superLikeupdate = (req, res) => {
  updateLike
    .superLikeupdate(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};

exports.disLikeupdate = (req, res) => {
  updateLike
    .disLikeupdate(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};
