const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const Axios = require('axios');
const Chalk = require('chalk');
const fs = require('fs');
const UserAccounts = require('../../Database/UserAccounts.js');

const SlashCommand = new SlashCommandBuilder()
SlashCommand.setName('staff-mute');
SlashCommand.setDescription('Mute a Discord user!');
SlashCommand.addUserOption((option) =>
option.setName('user').setDescription('Select the user you want to mute!').setRequired(true)
);
SlashCommand.addStringOption((option) =>
option.setName('time').setDescription('Select how long you want to mute them for!').setRequired(true)
);

module.exports = {
data: SlashCommand.toJSON(),                                                                    
async execute(Client, Interaction) {
        Interaction.reply({content: "Work in progress command."});

        
	},
};