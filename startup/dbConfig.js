const mongoose = require("mongoose")
module.exports = function () {
  // Configuring the database
  mongoose.Promise = global.Promise;

  let URL = process.env.DataBase;
  // if (process.env.NODE_ENV === "development") {
  //   URL = process.env.URL_DEV;
  // } else if (process.env.NODE_ENV === "test") {
  //   URL = process.env.URL_TEST;
  // } else {
  //   URL = process.env.URL_PROD;
  // }
  mongoose.set("strictQuery", false);

  mongoose
    .connect(URL, {
      useNewUrlParser: true, useUnifiedTopology: true
    })
    .then(() => {
      console.log("INFO: Successfully connected to the database");
    })
    .catch((err) => {
      console.log("INFO: Could not connect to the database.", err);
      process.exit();
    });
};
