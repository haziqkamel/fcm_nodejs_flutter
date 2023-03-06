const { sendPushNotificationSpecificUserDevice } = require('../controllers/push-notifications.controller')
const express = require('express')
const router = express.Router()

router.post('/send-push-notification-specific-user-device', sendPushNotificationSpecificUserDevice)

module.exports = router