const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const Axios = require('axios');
const Chalk = require('chalk');
const fs = require('fs');
const UserAccounts = require('../../Database/UserAccounts.js');

const SlashCommand = new SlashCommandBuilder()
SlashCommand.setName('server-create-list')
SlashCommand.setDescription('The list of servers you can create!')


module.exports = {
data: SlashCommand.toJSON(),                                                                    
async execute(Client, Interaction) {
	await Interaction.reply('Work in progress command.');
    
    return;
	},
};