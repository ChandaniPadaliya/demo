const sendResponse = require("../../helpers/sendResponse");

const postUser = require("./user.post");
const getUser = require("./user.get");
const deleteUser = require("./user.delete");
const putUser = require("./user.put");

//team create
exports.create = (req, res) => {
  postUser
    .register(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};
exports.payment = (req, res) => {
  postUser.payment(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};
exports.FeedbackUserCreate = (req, res) => {
  postUser
    .FeedbackUserCreate(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};

exports.FeedbackCreate = (req, res) => {
  postUser
    .FeedbackCreate(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};

exports.SurveyCreate = (req, res) => {
  postUser
    .SurveyCreate(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};

exports.SurveyUserCreate = (req, res) => {
  postUser
    .SurveyUserCreate(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};
exports.userInstall = (req, res) => {
  postUser.userInstall(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};
exports.block = (req, res) => {
  postUser
    .block(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};
exports.unblock = (req, res) => {
  postUser
    .unblock(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};
exports.joinNotification = (req, res) => {
  postUser
    .joinNotification(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};

exports.getFeedback = (req, res) => {
  getUser
    .getFeedback(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};

exports.getSurvey = (req, res) => {
  getUser
    .getSurvey(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};
exports.getAll = (req, res) => {
  getUser
    .getAll(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};
exports.getOne = (req, res) => {
  getUser
    .getOne(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};

exports.getDeleteUser = (req, res,) => {
  getUser.getDeleteUser(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((e) => {
      sendResponse(res, e);
    });
};

exports.getAllbyAdmin = (req, res) => {
  getUser
    .getAllByAdmin(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};
exports.updateUser = (req, res) => {
  putUser
    .update(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};
exports.deleteUser = (req, res) => {
  deleteUser
    .delete(req)
    .then((result) => {
      sendResponse(res, result);
    })
    .catch((err) => {
      sendResponse(res, err);
    });
};
