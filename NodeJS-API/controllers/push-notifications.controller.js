const admin = require('firebase-admin')
const fcm = require('fcm-notification')

const serviceAccount = require('../config/fcm-nodejs-demo-key.json')
const certPath = admin.credential.cert(serviceAccount)
const FCM = new fcm(certPath)

function sendPushNotificationSpecificUserDevice(req, res, next) {
    try {
        let message = {
            notification: {
                title: req.body.title,
                body: req.body.content,
            },
            data: req.body.data,
            token: req.body.fcm_token
        };

        FCM.send(message).then((response) => {
            console.log('Successfully sent message: ', response)
            return res.status(200).send({
                message: `Successfully sent message: ${response}`
            })
        }).catch((error) => {
            console.log('Error sending message: ', error)
            return res.status(500).send({
                message: error
            })
        })
    } catch (err) {
        console.log(`An error has occured: ${err}`);
        throw err;
    }
}

module.exports = {
    sendPushNotificationSpecificUserDevice,
}
