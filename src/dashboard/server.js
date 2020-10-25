const express = require('express')
const path = require('path')
const Logger = require('../util/Logger')

const app = express()
const port = process.env.PORT || 3000

app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => res.render('index'))

app.listen(port, () => { Logger.info(`Dashboard has started on ${port}`, { tag: 'Dashboard' }) })
