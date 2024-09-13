const DatauriParser = require("datauri/parser");
const path = require("path");
const cloudinary = require("../config/cloudinary");

exports.uploader = (file, originalname) => {
  return new Promise((resolve, reject) => {
    const parser = new DatauriParser();
    const image = parser.format(
      path.extname(file.originalname).toString(),
      file.buffer
    );
    cloudinary.uploader.upload(image.content, { resource_type: "auto" }, (error, result) => {
      if (error) return reject(error);
      resolve(result.secure_url);
    });
  });
};


exports.uploaders = (file) => {
  return new Promise((resolve, reject) => {
    const parser = new DatauriParser();
    const image = parser.format(
      path.extname(file.fileName).toString(),
      file.buffer
    );

    cloudinary.uploader.upload(image.content, { resource_type: "auto" }, (error, result) => {
      if (error) return reject(error);
      console.log('error: ', error);
      resolve(result.url);
    });
  });
};

exports.audioUpload = (file) => {
  return new Promise((resolve, reject) => {
    const parser = new DatauriParser();
    const files = parser.format(
      path.extname(file.originalname).toString(),
      file.buffer
    );

    cloudinary.uploader.upload(
      files.content,
      { resource_type: "video" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.url);
      }
    );
  });
};

exports.videoUpload = (file) => {
  return new Promise((resolve, reject) => {
    const parser = new DatauriParser();
    const files = parser.format(
      path.extname(file.fileName).toString(),
      file.buffer
    );

    cloudinary.uploader.upload(
      files.content,
      { resource_type: "video" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.url);
      }
    );
  });
};

exports.thumUploader = (originalname, buffer) => {
  return new Promise((resolve, reject) => {
    const parser = new DatauriParser();

    const image = parser.format(
      path.extname(originalname).toString(),
      buffer
    );

    cloudinary.uploader.upload(image.content, { resource_type: "video" }, (error, result) => {
      if (error) return reject(error);
      resolve(result.url);
    });
  });
};

exports.rawupload = (file) => {
  return new Promise((resolve, reject) => {
    const parser = new DatauriParser();
    const files = parser.format(
      path.extname(file.originalname).toString(),
      file.buffer
    );

    cloudinary.uploader.upload(
      files.content,
      { resource_type: "raw", format: "pdf" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.url);
      }
    );
  });
};

exports.uploaderd = (file) => {
  return new Promise((resolve, reject) => {
    let orignalName = file.mimetype.split("/");
    const parser = new DatauriParser();
    const image = parser.format(
      path.extname(orignalName[0] + "." + orignalName[1]).toString(),
      file.buffer
    );

    cloudinary.uploader.upload(
      image.content,
      { resource_type: "auto" },
      (err, result) => {
        console.log("error", err);
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
  });
};
