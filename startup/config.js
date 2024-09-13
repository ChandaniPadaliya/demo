
module.exports = function () {

  // set config 
  if (!process.env.jwrPrivatKey) {
    console.error("FATAL ERROR: key privet key is not define");
    process.exit(1);
  }

};