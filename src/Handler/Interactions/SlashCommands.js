const DiscordJS = require('discord.js');
const fs = require('fs');

module.exports = ({
    async execute(Client, Interaction){
    if (!Interaction.isCommand()) return;
	const SlashCommand = Client.SlashCommands.get(Interaction.commandName);
	if (!SlashCommand) return;
	try {
		await SlashCommand.execute(Client, Interaction);
	} catch (Error) {
		console.log(Error);
	}
    }
});