const fs = require('fs-extra');
const readline = require('readline');

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function fileOverwrite(path) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(path)) return resolve();

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(`file ${path} already exist, overwrite? (Y)`, answer => {
            rl.close();
            !answer || answer.toLowerCase().trim() === 'y' ? resolve() : reject(`aborted creation of ${path}`);
        });
    });
}

module.exports = {
    capitalize,
    fileOverwrite
};