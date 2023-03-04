const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const Axios = require('axios');
const Chalk = require('chalk');
const fs = require('fs');
const UserAccounts = require('../../Database/UserAccounts.js');

const SlashCommand = new SlashCommandBuilder()
SlashCommand.setName('server-create')
SlashCommand.setDescription('Create a Pterodactyl Server!')
SlashCommand.addStringOption((option) =>
option.setName('type').setDescription('Select the server type you want to create!').setRequired(true)
);
SlashCommand.addStringOption((option) => 
option.setName('name').setDescription('Select the name for your Pterodactyl Server!').setRequired(true)
);

module.exports = {
data: SlashCommand.toJSON(),                                                                    
async execute(Client, Interaction) {
	if(Interaction.user.id != 757296951925538856) return Interaction.reply({content: "Your are not authorized to user this command!"});

	const UserData = await UserAccounts.findOne({DiscordID: Interaction.user.id});

    const NoAccountEmbed = new DiscordJS.MessageEmbed()
    NoAccountEmbed.setTitle(`${Client.configuration.StaticEmotes.issue} No user account found!`);
    NoAccountEmbed.setColor('RED');
    NoAccountEmbed.setDescription('There was no panel account linked to your Discord. If you believe this is a mistake, please contact one of the Administrators.');
    NoAccountEmbed.setFooter({text: Client.user.tag, iconURL: Client.user.avatarURL({size: 4096, extension: "png"})});
    NoAccountEmbed.setTimestamp();

    if(UserData == null) return Interaction.reply({content: Interaction.user.toString(), embeds: [NoAccountEmbed]});

	const ServerType = await Interaction.options.getString('type');
	const ServerName = await Interaction.options.getString('name');
	const UserPanelID = UserData.ConsoleID;
	const Location = Client.configuration.Tokens.Pterodactyl.Locations[Math.floor(Math.random() * Client.configuration.Tokens.Pterodactyl.Locations.length)];

	if(Client.configuration.Tokens.Pterodactyl.Locations.length == 0) {
		const ErrorEmbed = new DiscordJS.MessageEmbed();
		ErrorEmbed.setTitle(`${Client.configuration.StaticEmotes.issue} Server creation is disabled!`);
		ErrorEmbed.setColor('RED');
		ErrorEmbed.setTimestamp();
		ErrorEmbed.setDescription(`Free server creation is currently disabled.`);		
		ErrorEmbed.setFooter({text: Client.configuration.DiscordBot.FooterNote, iconURL: Client.user.avatarURL()});
		return Interaction.reply({embeds: [ErrorEmbed], content: `${Interaction.member.toString()}`});
	};

	const Egg = fs.readdirSync('./src/Pterodactyl-Eggs/').filter(x => x.replace('.js', '') == ServerType.toLowerCase());

	if(Egg.length == 0){
		const ErrorEmbed = new DiscordJS.MessageEmbed();
		ErrorEmbed.setTitle(`${Client.configuration.StaticEmotes.issue} Invalid Server Type!`);
		ErrorEmbed.setColor('RED');
		ErrorEmbed.setTimestamp();
		ErrorEmbed.setDescription(`Please type use a valid server type! Use \`/create-list\` to see all valid server types.`);		
		ErrorEmbed.setFooter({text: Client.configuration.DiscordBot.FooterNote, iconURL: Client.user.avatarURL()});
		return Interaction.reply({embeds: [ErrorEmbed], content: `${Interaction.member.toString()}`});
	};

	const ServerData = require(`../../Pterodactyl-Eggs/${Egg}`)(UserPanelID, ServerName, Location);

	const FirstEmbed = new DiscordJS.MessageEmbed();
	FirstEmbed.setTitle('Server creation started...');
	FirstEmbed.setDescription(`${Client.configuration.StaticEmotes.idle} Attemping to create you a server, please wait. . .`);
	FirstEmbed.setColor('YELLOW');
	FirstEmbed.setTimestamp();
	FirstEmbed.setFooter({text: Client.configuration.DiscordBot.FooterNote, iconURL: Client.user.avatarURL()});

	await Interaction.reply({content: `${Interaction.member.toString()}`, embeds: [FirstEmbed]});

	const MessageReply = await Interaction.fetchReply();
	
	Axios({
		url: Client.configuration.Tokens.Pterodactyl.Link + '/api/application/servers',
		method: "POST",
		followRedirect: true,
        maxRedirects: 5,
        headers: {
            'Authorization': 'Bearer ' + Client.configuration.Tokens.Pterodactyl.APIKey,
            'Content-Type': 'application/json',
            'Accept': 'Application/vnd.pterodactyl.v1+json',
        },
		data: ServerData
	}).then(Request => {
		if(Request.status == 201){
			const SecondEmbed = new DiscordJS.MessageEmbed();
			const ServerButtonsRow = new DiscordJS.MessageActionRow();
			const ServerButton1 = new DiscordJS.MessageButton();
			const ServerButton2 = new DiscordJS.MessageButton();

			ServerButton1.setLabel('Server Link');
			ServerButton1.setStyle('LINK');
			ServerButton1.setEmoji(Client.configuration.StaticEmotes.panel);
			ServerButton1.setURL(`${Client.configuration.Tokens.Pterodactyl.Link}/server/${Request.data.attributes.identifier}`);

			ServerButton2.setLabel('Panel Link');
			ServerButton2.setStyle('LINK');
			ServerButton2.setEmoji(Client.configuration.StaticEmotes.panel);
			ServerButton2.setURL(`${Client.configuration.Tokens.Pterodactyl.Link}`);
			

			ServerButtonsRow.addComponents(ServerButton1, ServerButton2);

			SecondEmbed.setTitle(`${Client.configuration.StaticEmotes.online} Successfully created a ${ServerType} server!`);
			SecondEmbed.setColor('GREEN');
			SecondEmbed.setTimestamp();
			SecondEmbed.addField('Server Name:', ServerName, false);
			SecondEmbed.addField('Server Type:', ServerType, false);
			SecondEmbed.addField('Server Creation Date:', `<t:${Math.floor(Date.now()/1000)}:F>`, false);
			SecondEmbed.addField('Server Identifier:', Request.data.attributes.identifier, false);
			SecondEmbed.setFooter({text: Client.configuration.DiscordBot.FooterNote, iconURL: Client.user.avatarURL()});

			MessageReply.edit({embeds: [SecondEmbed], content: `${Interaction.member.toString()}`, components: [ServerButtonsRow]});
		} else {
			MessageReply.edit("I ran into an unexpected error. Please try again later!");
		};
	}).catch((Error) => {
		console.log(Error);
		const ErrorEmbed = new DiscordJS.MessageEmbed();

		ErrorEmbed.setTitle(`${Client.configuration.StaticEmotes.issue} Fatal Error has been Encountered!`);
		ErrorEmbed.setColor('RED');
		ErrorEmbed.setTimestamp();
		ErrorEmbed.addField('Error Status:', `${Error.response.data.errors[0].status}`, false);
		ErrorEmbed.addField('Error Text:', `${Error.response.data.errors[0].detail}`, false);
		ErrorEmbed.addField('Error Code:', `${Error.response.data.errors[0].code}`, false);
		ErrorEmbed.setFooter({text: Client.configuration.DiscordBot.FooterNote, iconURL: Client.user.avatarURL()});

		MessageReply.edit({embeds: [ErrorEmbed], content: `${Interaction.member.toString()}`});
	}).finally(() => {
			console.log(`${Chalk.bold.black('[Discord]')} ${Chalk.green(`${Interaction.user.tag} Just used the /create slash command.`)}`);
		});
	},
};