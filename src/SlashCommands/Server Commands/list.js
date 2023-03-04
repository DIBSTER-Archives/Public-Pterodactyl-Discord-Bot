const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const Axios = require('axios');
const Chalk = require('chalk');
const fs = require('fs');
const UserAccounts = require('../../Database/UserAccounts.js');

const SlashCommand = new SlashCommandBuilder()
SlashCommand.setName('server-list')
SlashCommand.setDescription('Show\'s all your servers on your panel account.')

module.exports = {
data: SlashCommand.toJSON(),                                                                    
async execute(Client, Interaction) {
	await Interaction.reply('Work in progress command.');
    
    return;
	},
};