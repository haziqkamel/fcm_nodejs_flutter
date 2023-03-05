const { sendPushNotification } = require('../controllers/push-notifications.controller')
const express = require('express')
const router = express.Router()

router.post('/send-notification', sendPushNotification)

module.exports = router