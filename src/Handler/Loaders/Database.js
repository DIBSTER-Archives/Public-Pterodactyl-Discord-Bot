const MongoDB = require('mongoose');
const Configuration = require('../../Configuration/config.json');
const Chalk = require('chalk');
const fs = require('fs');

const DatabaseModels = fs.readdirSync('./src/Database/');

MongoDB.connect(Configuration.Tokens.MongoDB, async () => {
    console.log(`${Chalk.bold.black('[Loader] ')}${Chalk.bold.greenBright('Corrected to Mongo Database.')}`);
    for (DatabaseModel of DatabaseModels){
        require(`../../Database/${DatabaseModel}`);
    };
    console.log(`${Chalk.bold.black('------------------------------------------------------------------------------------------------------')}`);
}).catch((Error) => {
    console.log(Error);
}).finally(() => {
    console.log(`${Chalk.bold.black('[Loader] ')}${Chalk.bold.greenBright('Database connection closed.')}`);
});