const { green, yellow, red } = require('chalk');

module.exports = {
    
    info(str) {
        console.log(str);
    },

    success(str) {
        console.log(green(str));
    },

    warn(str) {
        console.log(yellow(str));
    },

    error(str) {
        console.log(red(str));
    }
}