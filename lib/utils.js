const fs = require('fs-extra');
const readline = require('readline');

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeAll(arr) {
    return arr.map(str => capitalize(str)).join('');
}

function capitalizeFileName(path) {
    path = path.split('/');
    path[path.length -1] = capitalize(path[path.length - 1]);
    return path.join('/');
}

function fileOverwrite(path) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(path)) return resolve();

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(`file ${path} already exist, overwrite?(N): `, answer => {
            rl.close();
            if (answer.toLowerCase().trim() === 'y') return resolve();
            reject(`aborted creation of ${path}`);
        });
    });
}

module.exports = {
    capitalize,
    capitalizeAll,
    capitalizeFileName,
    fileOverwrite
};