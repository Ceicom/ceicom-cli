const fs = require('fs-extra');

const { capitalizeAll, fileOverwrite } = require('./utils');

module.exports = class Taks {
    constructor(config) {
        this.config = config;

        this.type = config.type;
        this.name = config.name;
        this.modelPath = config.modelPath;
        this.folderPath = config.folderPath;
        this.isCombo = config.isCombo || false;

        this.tasks = {
            page(str) {
                const { name } = config;
                str = str.replace(/\[name\]/g, name);
                str = str.replace('getData', `getData${capitalizeAll(name.split('-'))}`);
                return str;
            },

            template(str) {
                const { name } = config;
                str = str.replace(/\[name\]/g, name);
                str = str.replace('getData', `getData${capitalizeAll(name.split('-'))}`);
                return str;
            },

            webform(str) {
                const { name } = config;
                const netClass = config.folderPath.slice(2).replace(/[\/-]/g, '_');
                str = str.replace('[metaTag]', `${config.isCombo ? `<meta id="jsPageID" data-value="pages/${name}" />` : ''}`);
                if (config.modelPath.indexOf('.cs') > -1)
                    str = str.replace('[className]', netClass.replace('.aspx.cs', ''));
                else
                    str = str.replace('[className]', netClass);
                return str;
            }
        }
    }

    runTaks() {
        return new Promise((resolve, reject) =>
            fileOverwrite(this.folderPath).then(() => {
                if (this.type === 'less') {
                    const buffer = fs.readFileSync('./dev/less/main.less');
                    let fileStr = buffer.toString();
                    if (fileStr.indexOf(`pages/${this.name}`) < 0) {
                        fileStr = fileStr.concat(`\n@import 'pages/${this.name}';`);
                        fs.outputFileSync('./dev/less/main.less', fileStr);
                    }
                }

                if (!this.modelPath) {
                    fs.outputFileSync(this.folderPath, '');
                    return resolve();
                }

                const buffer = fs.readFileSync(this.modelPath);
                let fileStr = buffer.toString();

                fileStr = this.taksRaplace(fileStr);
                fs.outputFileSync(this.folderPath, fileStr);

                resolve();
            }).catch(reject));
    }

    taksRaplace(str) {
        if (!this.tasks[this.type]) return str;
        return this.tasks[this.type](str);
    }
}