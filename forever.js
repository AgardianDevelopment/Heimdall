const forever = require('forever-monitor')

const bot = new (forever.Monitor)('./heimdallr.js', {
  silent: true,
  uid: 'heim',
  max: 3,
  minUptime: 5000,
  spinSleepTime: 1000
})

bot.on('exit', function () {
  console.log('Heimdallr has exited after 3 restarts')
})

bot.start()
