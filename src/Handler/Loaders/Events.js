const fs = require('fs');
const Chalk = require('chalk');
const EventFolders = fs.readdirSync('./src/Events/');

console.log(`${Chalk.bold.black('------------------------------------------------------------------------------------------------------')}`);
console.log(`${Chalk.gray(`[Loader] `)}${Chalk.bold.greenBright(`Loaded into`)} ${Chalk.bold.redBright(`Events Folder`)}`);

FolderCount = 0;

EventFolders.forEach(Folder => {
    FolderCount++;
    FileCount = 0;
    //╚ ╔ ╦ ═ ╠ ║

    const EventFiles = fs.readdirSync(`./src/Events/${Folder}/`);

    if(EventFolders.length == FolderCount){
        if(EventFiles.length == 0){
            console.log(`${Chalk.gray(`[Loader] `)}${Chalk.bold.greenBright(`╚═════> Loaded into`)} ${Chalk.bold.redBright(`${Folder}`)}`);
        } else {
            console.log(`${Chalk.gray(`[Loader] `)}${Chalk.bold.greenBright(`╚═══╦═> Loaded into`)} ${Chalk.bold.redBright(`${Folder}`)}`);
        };
    } else {
        if(EventFiles.length == 0){
            console.log(`${Chalk.gray(`[Loader] `)}${Chalk.bold.greenBright(`╠═════> Loaded into`)} ${Chalk.bold.redBright(`${Folder}`)}`);
        } else {
            console.log(`${Chalk.gray(`[Loader] `)}${Chalk.bold.greenBright(`╠═══╦═> Loaded into`)} ${Chalk.bold.redBright(`${Folder}`)}`);
        };
    };

    EventFiles.filter(File => File.endsWith('.js')).forEach(File => {
        FileCount++;
        if(FileCount != EventFiles.length){
            if(EventFolders.length == FolderCount){
                console.log(`${Chalk.gray(`[Loader] `)}${Chalk.bold.greenBright(`    ╠══════> Successfully started`)} ${Chalk.bold.blueBright(`${File}`)} ${Chalk.bold.black(`(${FileCount}/${EventFiles.length})`)}`); //Fancy console output.
            } else {
                console.log(`${Chalk.gray(`[Loader] `)}${Chalk.bold.greenBright(`║   ╠══════> Successfully started`)} ${Chalk.bold.blueBright(`${File}`)} ${Chalk.bold.black(`(${FileCount}/${EventFiles.length})`)}`); //Fancy console output.
            };
        } else {
            if(EventFolders.length == FolderCount){
                console.log(`${Chalk.gray(`[Loader] `)}${Chalk.bold.greenBright(`    ╚══════> Successfully started`)} ${Chalk.bold.blueBright(`${File}`)} ${Chalk.bold.black(`(${FileCount}/${EventFiles.length})`)}`); //Fancy console output.
            } else {
                console.log(`${Chalk.gray(`[Loader] `)}${Chalk.bold.greenBright(`║   ╚══════> Successfully started`)} ${Chalk.bold.blueBright(`${File}`)} ${Chalk.bold.black(`(${FileCount}/${EventFiles.length})`)}`); //Fancy console output.
            };
        };
        require(`../../Events/${Folder}/${File}`);
    });
});

console.log(`${Chalk.bold.black('------------------------------------------------------------------------------------------------------')}`);