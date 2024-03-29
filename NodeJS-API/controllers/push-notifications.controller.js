const admin = require("firebase-admin");
const fcm = require("fcm-notification");

const serviceAccount = require("../config/fcm-nodejs-demo.json");
const certPath = admin.credential.cert(serviceAccount);
const FCM = new fcm(certPath);

function sendPushNotificationSpecificUserDevice(req, res, next) {
  const {
    title,
    content,
    imageUrl,
    data,
    fcm_token,
    path,
    name,
    chatMessage,
    chatId,
  } = req.body;

  console.log(req.body);

  if (
    title == null ||
    content == null ||
    imageUrl == null ||
    data == null ||
    fcm_token == null ||
    chatId == null ||
    chatMessage == null
  ) {
    return res.status(500).send({
      message: "Required field missing",
    });
  }

  try {
    // Build data-only notification for chatting
    let message = {
      data: {
        data: data,
        path: path,
        imageUrl: imageUrl,
        name: name,
        message: chatMessage,
        chatId: chatId,
      },
      token: fcm_token,
    };

    FCM.send(message, function (err, resp) {
      if (err) {
        console.log("Error sending message: ", err);
        return res.status(500).send({
          message: err,
        });
      }
      console.log("Successfully sent message: ", resp);
      return res.status(200).send({
        message: `Successfully sent message: ${resp}`,
      });
    });
  } catch (err) {
    console.log(`An error has occured: ${err}`);
    throw err;
  }
}

function sendMessageToMultipleDevices(req, res, next) {
  try {
    let message = {
      notification: {
        title: req.body.title,
        body: req.body.content,
      },
      android: {
        notification: {
          icon: "stock_ticker_update",
          color: "#7e55c3",
        },
      },
      data: req.body.data,
      tokens: req.body.fcm_tokens,
    };

    FCM.sendMulticast(message, function (err, resp) {
      if (err) {
        console.log("Error sending message: ", err);
        return res.status(500).send({
          message: err,
        });
      }
      console.log(`${resp.successCount} + messages were sent successfully`);
      if (resp.failureCount > 0) {
        const failedTokens = [];
        resp.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(registrationTokens[idx]);
          }
        });
        console.log("List of tokens that caused failures: " + failedTokens);
      }
      return res.status(200).send({
        message: `Successfully sent message: ${resp}`,
      });
    });
  } catch (err) {
    console.log(`An error has occured: ${err}`);
    throw err;
  }
}

function sendToTopics(req, res, next) {
  let topic = "beritaTular";
  if (topic == null) {
    return res.status(400).send({ message: "topic is required!" });
  } else {
    topic = req.body.topic;
  }
  let title = req.body.title;
  if (title == null || title == "") {
    return res.status(400).send({ message: "title is required!" });
  }
  let body = req.body.content;
  if (body == null || body == "") {
    return res.status(400).send({ message: "content is required!" });
  }
  let data = req.body.data;
  if (data == null || data == {}) {
    return res.status(400).send({ message: "data is required!" });
  }
  let imageUrl = req.body.imageUrl;
  if (imageUrl == null || imageUrl == "") {
    return res.status(400).send({ message: "imageUrl is required!" });
  }

  try {
    let message = {
      topic: topic,
      notification: {
        title: title,
        body: body,
      },
      android: {
        notification: {
          image: imageUrl,
        },
      },
      apns: {
        payload: {
          aps: {
            "mutable-content": 1,
          },
        },
        fcm_options: {
          image: imageUrl,
        },
      },
      data: data,
    };

    FCM.send(message, function (err, resp) {
      if (err) {
        console.log("Error sending message: ", err);
        return res.status(500).send({
          message: err,
        });
      }

      console.log(`Successfully sent message: ${resp}`);
      return res.status(200).send({
        message: `Successfully sent message: ${resp}`,
      });
    });
  } catch (err) {
    console.log(`An error has occured: ${err}`);
    throw err;
  }
}

module.exports = {
  sendPushNotificationSpecificUserDevice,
  sendMessageToMultipleDevices,
  sendToTopics,
};
