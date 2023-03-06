const express = require('express')
const router = express.Router()
const {
    sendPushNotificationSpecificUserDevice,
    sendMessageToMultipleDevices,
    sendToTopics
} = require('../controllers/push-notifications.controller')

router.post('/send-push-notification-specific-user-device',
    sendPushNotificationSpecificUserDevice
);
router.post('/send-message-to-multiple-devices',
    sendMessageToMultipleDevices
);
router.post('/send-to-topics',
    sendToTopics
);

module.exports = router