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
                imageUrl: req.body.imageUrl,
            },
            android: {
                notification: {
                    icon: 'stock_ticker_update',
                    color: '#7e55c3'
                }
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

function sendMessageToMultipleDevices(req, res, next) {
    try {
        let message = {
            notification: {
                title: req.body.title,
                body: req.body.content,
            },
            android: {
                notification: {
                    icon: 'stock_ticker_update',
                    color: '#7e55c3'
                }
            },
            data: req.body.data,
            tokens: req.body.fcm_tokens
        };

        FCM.sendMulticast(message).then((response) => {
            console.log(`${response.successCount} + messages were sent successfully`)
            if (response.failureCount > 0) {
                const failedTokens = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        failedTokens.push(registrationTokens[idx]);
                    }
                });
                console.log('List of tokens that caused failures: ' + failedTokens);
            }
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
    sendMessageToMultipleDevices
}
