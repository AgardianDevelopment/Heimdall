const { DRepClient } = require('@drep/api')
const drep = new DRepClient(process.env.DREP)

const reputation = async (user) => {
  const rep = await drep.rep(user)
  return rep
}

module.exports = {
  reputation
}
