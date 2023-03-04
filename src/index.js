const DiscordJS = require('discord.js');
const Configuration = require('./Configuration/config.json');

const Client = new DiscordJS.Client(require('./Handler/Others/Client.js'));

Client.configuration = Configuration;

module.exports = Client;

require('./Handler/index.js');

Client.login(Configuration.Tokens.DiscordBot);