const { Command } = require('discord-akairo');

class DeleteStarCommand extends Command {
	constructor() {
		super('delete', {
			aliases: ['delete'],
			category: 'starboard',
			channelRestriction: 'guild',
			userPermissions: ['MANAGE_MESSAGES'],
			clientPermissions: ['MANAGE_MESSAGES'],
			args: [
				// Indices are swapped in order to process channel first.
				{
					id: 'channel',
					match: 'rest',
					index: 1,
					type: 'textChannel',
					default: message => message.channel,
					prompt: {
						start: msg => `${msg.author} **::** That channel could not be found. What channel is the message you are trying to remove from the starboard in?`,
						retry: msg => `${msg.author} **::** Please provide a valid text channel.`,
						optional: true
					}
				},
				{
					id: 'message',
					index: 0,
					type: (word, message, { channel }) => {
						if (!word) return null;
						// eslint-disable-next-line prefer-promise-reject-errors
						return channel.fetchMessage(word).catch(() => Promise.reject());
					},
					prompt: {
						start: msg => `${msg.author} **::** What is the ID of the message you would like to remove from the starboard?`,
						retry: (msg, { channel }) => `${msg.author} **::** Oops! I can't find that message in ${channel}. Remember to use its ID.`
					}
				}
			]
		});
	}

	async exec(message, { message: msg }) {
		const starboard = this.client.starboards.get(message.guild.id);

		if (!starboard.stars.has(msg.id)) {
			return message.util.reply('The message cannot be removed because it does not exist in the starboard.');
		}

		const error = await starboard.delete(msg);
		if (error) {
			return message.util.reply(error);
		}

		await msg.clearReactions();
		return message.util.reply('The message has been removed from the starboard.');
	}
}

module.exports = DeleteStarCommand;