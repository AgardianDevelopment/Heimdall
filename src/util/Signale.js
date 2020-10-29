const signale = require('signale')

signale.config({
  displayScope: false,
  displayBadge: true,
  displayDate: true,
  displayFilename: true,
  displayLable: true,
  displayTimestamp: true,
  underlineLabel: true,
  underlineMessage: false,
  underlinePrefix: false,
  underlineSuffix: false,
  uppercaseLabel: true
})

module.exports = signale

/**
 * * Available Loggers
 * ? await
 * ? complete
 * ? error
 * ? debug
 * ? fatal
 * ? fav
 * ? info
 * ? note
 * ? pause
 * ? pending
 * ? star
 * ? start
 * ? success
 * ? wait
 * ? warn
 * ? watch
 * ? log
 */
