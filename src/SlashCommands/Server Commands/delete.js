const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const Axios = require('axios');
const Chalk = require('chalk');
const fs = require('fs');
const UserAccounts = require('../../Database/UserAccounts.js');

const SlashCommand = new SlashCommandBuilder()
SlashCommand.setName('server-delete')
SlashCommand.setDescription('Deletes a Pterodactyl Server!')
SlashCommand.addStringOption((option) => 
option.setName('id').setDescription('The server ID you want to delete.').setRequired(true)
);

module.exports = {
data: SlashCommand.toJSON(),                                                                    
async execute(Client, Interaction) {
	await Interaction.reply('Work in progress command.');
    
    return;
	},
};