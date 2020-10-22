const loading = async (client) => {
  const loadEmoji = await this.client.emojis.resolve('541151509946171402')
  return loadEmoji
}

const invalid = async () => {
  const crossEmoji = await this.client.emojis.resolve('541151482599440385')
  return crossEmoji
}

const valid = async (client) => {
  const checkEmoji = await this.client.emojis.resolve('541151462642941962')
  return checkEmoji
}

module.exports = {
  loading,
  invalid,
  valid
}
