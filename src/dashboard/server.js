const express = require('express')
const path = require('path')
const Logger = require('../util/Logger')

const app = express()
const port = process.env.PORT || 3000

app
  .use(express.static(path.join(__dirname, '/')))
  .engine('html', require('ejs').renderFile)
  .set('view engine', 'ejs')
  .set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => res.render('index'))
app.get('/commands', (req, res) => res.render('commands'))

app.listen(port, () => { Logger.info(`Dashboard has started on ${port}`, { tag: 'Dashboard' }) })
