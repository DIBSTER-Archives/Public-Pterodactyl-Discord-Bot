const Client = require('../../index.js');
const DiscordJS = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const Chalk = require('chalk');

/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/* Slash Commands.*/
Client.SlashCommands = new DiscordJS.Collection();

const Slash_CommandFolder = fs.readdirSync('./src/SlashCommands');

setTimeout(() => {
console.log(`${Chalk.gray(`[Loader] `)}${Chalk.bold.greenBright(`Loaded into`)} ${Chalk.bold.redBright(`Slash Commands Folder`)}`);

FolderCount = 0;

Slash_CommandFolder.forEach(Slash_CommandCategory => {
    FolderCount++;
    FileCount = 0;

    const SlashCommandFiles = fs.readdirSync(`./src/SlashCommands/${Slash_CommandCategory}/`);
    
    if(Slash_CommandFolder.length == FolderCount){
        if(SlashCommandFiles.length == 0){
            console.log(`${Chalk.gray(`[Loader] `)}${Chalk.bold.greenBright(`╚═════> Loaded into`)} ${Chalk.bold.redBright(`${Slash_CommandCategory}`)}`);
        } else {
            console.log(`${Chalk.gray(`[Loader] `)}${Chalk.bold.greenBright(`╚═══╦═> Loaded into`)} ${Chalk.bold.redBright(`${Slash_CommandCategory}`)}`);
        };
    } else {
        if(SlashCommandFiles.length == 0){
            console.log(`${Chalk.gray(`[Loader] `)}${Chalk.bold.greenBright(`╠═════> Loaded into`)} ${Chalk.bold.redBright(`${Slash_CommandCategory}`)}`);
        } else {
            console.log(`${Chalk.gray(`[Loader] `)}${Chalk.bold.greenBright(`╠═══╦═> Loaded into`)} ${Chalk.bold.redBright(`${Slash_CommandCategory}`)}`);
        };
    };

    SlashCommandFiles.filter(Command => Command.endsWith('.js')).forEach(File => {
        FileCount++;

        if(FileCount != SlashCommandFiles.length){
            if(Slash_CommandFolder.length == FolderCount){
                console.log(`${Chalk.gray(`[Loader] `)}${Chalk.bold.greenBright(`    ╠══════> Successfully started`)} ${Chalk.bold.blueBright(`${File}`)} ${Chalk.bold.black(`(${FileCount}/${SlashCommandFiles.length})`)}`); //Fancy console output.
            } else {
                console.log(`${Chalk.gray(`[Loader] `)}${Chalk.bold.greenBright(`║   ╠══════> Successfully started`)} ${Chalk.bold.blueBright(`${File}`)} ${Chalk.bold.black(`(${FileCount}/${SlashCommandFiles.length})`)}`); //Fancy console output.
            };
        } else {
            if(Slash_CommandFolder.length == FolderCount){
                console.log(`${Chalk.gray(`[Loader] `)}${Chalk.bold.greenBright(`    ╚══════> Successfully started`)} ${Chalk.bold.blueBright(`${File}`)} ${Chalk.bold.black(`(${FileCount}/${SlashCommandFiles.length})`)}`); //Fancy console output.
            } else {
                console.log(`${Chalk.gray(`[Loader] `)}${Chalk.bold.greenBright(`║   ╚══════> Successfully started`)} ${Chalk.bold.blueBright(`${File}`)} ${Chalk.bold.black(`(${FileCount}/${SlashCommandFiles.length})`)}`); //Fancy console output.
            };
        };

        const SlashCommandData = require(`../../SlashCommands/${Slash_CommandCategory}/${File}`);
        Client.SlashCommands.set(SlashCommandData.data.name, SlashCommandData);
    });   
});
console.log(`${Chalk.bold.black('------------------------------------------------------------------------------------------------------')}`);
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/* Registering Slash Commands.*/

const SlashCommands = [];
const DevGuildId = `${Client.configuration.Development.GuildId}`;
const DevClientId = `${Client.configuration.Development.ClientId}`;

Slash_CommandFolder.forEach(Slash_CommandCategories => {
    const SlashCommandFiles = fs.readdirSync(`./src/SlashCommands/${Slash_CommandCategories}`).filter(Command => Command.endsWith('.js'));

    SlashCommandFiles.forEach(SlashCommandFile => {
        const SlashCommandFileData = require(`../../SlashCommands/${Slash_CommandCategories}/${SlashCommandFile}`);
        SlashCommands.push(SlashCommandFileData.data);
    });
});


const rest = new REST({ version: '9' }).setToken(Client.configuration.Tokens.DiscordBot);

;(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(DevClientId, DevGuildId),
			{ body: SlashCommands },
		);
	} catch (Error) {
		console.error(Error);
	}
})();
}), 1000;

Client.on('interactionCreate', async (Interaction) => {
    if(Interaction.isApplicationCommand()){
        const File = require('../../Handler/Interactions/SlashCommands.js');
        await File.execute(Client, Interaction);
    } else if (Interaction.isContextMenu()) {

    } else if (Interaction.isButton()) {

    } else if (Interaction.isSelectMenu()){

    } else if (Interaction.isUserContextMenu()){
        
    };
});