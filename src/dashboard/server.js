const express = require('express')
const Logger = require('../util/Logger')

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => res.redner('./views/index.pug'))

app.listen(port, () => { Logger.info(`Dashboard has started on ${port}`, { tag: 'Dashboard' }) })
