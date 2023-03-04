const Client = require('../../index.js');
const Chalk = require('chalk');

Client.once('ready', async (Client) => {
    Client.user.setPresence({activities: [{name: Client.configuration.DiscordBot.StatusName, type: 'WATCHING'}], status: Client.configuration.DiscordBot.StatusType});
    console.log(`${Chalk.bold.black('[Loader] ')}${Chalk.bold.greenBright('Connected to ' + Client.user.tag)}`);
    console.log(`${Chalk.bold.black('------------------------------------------------------------------------------------------------------')}`);
});