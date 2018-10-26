const { green, yellow, red, blue } = require('chalk');

module.exports = {
    
    info(str) {
        console.log(str);
    },

    special(str) {
        console.log(blue(str));
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