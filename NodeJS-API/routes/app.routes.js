const express = require("express");
const router = express.Router();
const {
  sendPushNotificationSpecificUserDevice,
  sendMessageToMultipleDevices,
  sendToTopics,
} = require("../controllers/push-notifications.controller");

const {
  huaweiSendataMessage,
} = require("../controllers/huawei-push-notifications.controller");

// Firebase Android and iOS
router.post(
  "/send-push-notification-specific-user-device",
  sendPushNotificationSpecificUserDevice
);
router.post("/send-message-to-multiple-devices", sendMessageToMultipleDevices);
router.post("/send-to-topics", sendToTopics);

// HMS Huawei
router.post("/huawei/notification/send-data", huaweiSendataMessage);

module.exports = router;
