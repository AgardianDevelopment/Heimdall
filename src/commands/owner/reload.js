const { Command } = require('discord-akairo');
const Logger = require('../../util/Logger');

class ReloadCommand extends Command {
	constructor() {
		super('reload', {
			aliases: ['reload', 'r'],
			category: 'owner',
			ownerOnly: true,
			protected: true,
			args: [
				{
					id: 'type',
					match: 'prefix',
					prefix: ['--type=', '-T='],
					type: [['command', 'c'], ['inhibitor', 'i'], ['listener', 'l']],
					default: 'command'
				},
				{
					id: 'module',
					type: (word, message, { type }) => {
						if (!word) return null;
						const resolver = this.client.commandHandler.resolver.type({
							command: 'commandAlias',
							inhibitor: 'inhibitor',
							listener: 'listener'
						}[type]);

						return resolver(word);
					}
				}
			]
		});
	}

	exec(message, { type, module: mod }) {
		if (!mod) {
			return message.util.send(`Invalid ${type} ${type === 'command' ? 'alias' : 'ID'} specified to reload.`);
		}

		try {
			mod.reload();
			return message.util.send(`Sucessfully reloaded ${type} \`${mod.id}\`.`);
		} catch (err) {
			Logger.error(`Error occured reloading ${type} ${mod.id}`);
			Logger.stacktrace(err);
			return message.util.send(`Failed to reload ${type} \`${mod.id}\`.`);
		}
	}
}

module.exports = ReloadCommand;