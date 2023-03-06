const { 
    sendPushNotificationSpecificUserDevice, 
    sendMessageToMultipleDevices 
} = require('../controllers/push-notifications.controller')
const express = require('express')
const router = express.Router()

router.post('/send-push-notification-specific-user-device', 
sendPushNotificationSpecificUserDevice
);
router.post('/send-message-to-multiple-devices', 
sendMessageToMultipleDevices
);

module.exports = router