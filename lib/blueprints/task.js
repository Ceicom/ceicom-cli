const fs = require('fs-extra');

module.exports = class Task {
    constructor(config) {
        this.config = config;
    }

    beforeRun() {
        
    }

    run() {

    }

    replace() {

    }

    afterRun() {
        fs.outputFileSync(this.folderPath, fileStr);
    }
}