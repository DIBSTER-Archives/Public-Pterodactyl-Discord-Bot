const fs = require('fs');

const LoaderFiles = fs.readdirSync('./src/Handler/Loaders');

for (File of LoaderFiles) {
    require(`./Loaders/${File}`);
};