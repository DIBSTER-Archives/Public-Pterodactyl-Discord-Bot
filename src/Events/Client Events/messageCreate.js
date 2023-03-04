const Client = require('../../index.js');
const DiscordJS = require('discord.js');
const fs = require('fs');

/* Message Commands.*/
Client.MessageCommands = new DiscordJS.Collection();

const Message_CommandFolder = fs.readdirSync('./src/MessageCommands');

for (Message_CommandCategory of Message_CommandFolder){
    fs.readdirSync(`./src/SlashCommands/${Message_CommandCategory}/`).forEach(file => {
        const MessageCommandData = require(`../../MessageCommands/${Message_CommandCategory}/${file}`);
        Client.MessageCommands.set(MessageCommandData.name, MessageCommandData);
    });
};

Client.on('messageCreate', async (message) => {
    if (!message.content.startsWith('dib!')) return;
    const Arguements = message.content.slice(1).trim().split(/ +/);
    const CommandName = Arguements.shift().toLowerCase();

    const Command = Client.MessageCommands.get(CommandName) || Client.MessageCommands.find(c => c.aliases && c.aliases.includes(CommandName));
    if(!Command) return;

    if(Command.guildOnly == true && message.channel.type === 'DM') return;

    try{
        await Command.execute(message, Arguements, Client);
    } catch (Error){
        message.reply('There was a error while trying to run that command!');
        console.log(Error);
    };
});