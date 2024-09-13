const gcm = require("node-gcm");
const config = require("../config/default");

exports.sendAndroid = (device, data) => {

  let message = new gcm.Message({
    notification: {
      title: data.title,
      body: data.message,
      user: data.user,
      priority: "high",
      group: "GROUP",
      sound: "default",
      show_in_foreground: "true",
    },
    data: {
      title: data.title,
      body: data.message,
      user: data.user,
      date: data.date,
      type: data.type,
    }
  });

  console.log("🚀 ~ file: notification.js ~ line 22 ~ sender.send ~ device", device);

  let sender = new gcm.Sender(config.GCM_API_KEY);

  sender.send(message, { registrationTokens: device }, function (err, response) {
    if (err) {
      console.error("err: " + err);
    } else {
      console.log("Notification response: " + JSON.stringify(response));
    }
  });
};


exports.sendMessage = (device, title, body, user, name) => {
  const message = new gcm.Message({
    to: device,
    notification: {
      title,
      body,
      user,
      name,
      show_in_foreground: true,
    },
    data: {
      "user": user,
      "name": name
    }
  });
  const send = new gcm.Sender(config.GCM_API_KEY);

  send.send(
    message,
    {
      registrationTokens: device,
    },
    function (err, res) {
      console.log("res: ", res);
      if (err) {
        console.log("err:----", err);
      }
    }
  );
};

exports.sendIos = (device, title, body, user, name) => {
  let message = new gcm.Message({
    notification: {
      title,
      body,
      user,
      name,
      show_in_foreground: true,
    },
    data: {
      "user": user,
      "name": name
    }
  });
  let sender = new gcm.Sender(config.GCM_API_KEY);
  sender.send(
    message,
    {
      registrationTokens: device,
    },
    function (err, response) {
      console.log("response: ", response);
      if (err) {
        console.log("err----", err);
      }
    }
  );
};

