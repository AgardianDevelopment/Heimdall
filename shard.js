const { ShardingManager } = require('discord.js')
require('dotenv').config()
const Logger = require('./src/util/Logger')

const manager = new ShardingManager('./heimdall.js', { token: process.env.BOT_TOKEN })

manager.spawn()
manager.on('shardCreate', shard => Logger.info(`Launched shard ${shard.id}`, { tag: 'Shard' }))
