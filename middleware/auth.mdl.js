const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const serviceUser = require("../services/mongoDbService")({ model: User });

exports.auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) return res.status(401).json("Access Denied, no token providedd");
    const decod = jwt.verify(token, process.env.jwrPrivatKey);
    // req.user = decod;
    let user = await serviceUser.getSingleDocumentById(decod._id);
    if (!user) return res.status(500).json("please enter valid token");
    req.user = user;
    next();

  }
  catch (err) {
    console.log('err: ', err);
    res.status(400).json(err);
  }
};