const express = require('express')
const app = express()

const PORT_NUMBER = 4000;

/**
 * Middleware setting
 */
app.use(express.json())

/**
 * Route Settings
 */
app.use('/api', require('./routes/app.routes'))

app.listen(PORT_NUMBER, () =>
    console.log(`Listening on port: ${PORT_NUMBER}`)
)