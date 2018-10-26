const fs = require('fs-extra');
const { green } = require('chalk');
const log = console.log;

const { capitalize, fileOverwrite } = require('./utils');

module.exports = class Generator {
    constructor(config) {
        this.config = config;
    }

    page(name, doTemplate = false) {
        return new Promise(resolve => {
            const { jsInitFolder } = this.config;
            const folderPath = `${jsInitFolder}/pages/${name}.js`;

            log(`generating page "${name}"`);
            fileOverwrite(folderPath).then(() => {
                const buffer = fs.readFileSync(`${jsInitFolder}/pages/model.js`);
                let fileStr = buffer.toString();

                fileStr = fileStr.replace(/\[name\]/g, name);
                fileStr = fileStr.replace('getData', `getData${capitalize(name)}`);
                fs.writeFileSync(folderPath, fileStr);

                log(green('page was generated with success'));
                resolve();
                if (doTemplate) this.template(name);
            }).catch(err => {
                log(err);
                resolve();
            });
        });
    }

    template(name) {
        return new Promise(resolve => {
            const { jsInitFolder } = this.config;
            const folderPath = `${jsInitFolder}/templates/${name}.js`;

            log(`generating template "${name}"`);
            fileOverwrite(folderPath).then(() => {
                const buffer = fs.readFileSync(`${jsInitFolder}/templates/model.js`);
                let fileStr = buffer.toString();

                fileStr = fileStr.replace(/\[name\]/g, name);
                fileStr = fileStr.replace('getData', `getData${capitalize(name)}`);
                fs.writeFileSync(folderPath, fileStr);

                log(green('template was generated with success'));
                resolve();
            }).catch(err => {
                log(err);
                resolve();
            });
        });
    }

    less(name) {
        return new Promise(resolve => {
            const folderPath = `./dev/less/page/${name}.less`;

            log(`generating less "${name}"`);
            fileOverwrite(folderPath).then(() => {
                fs.outputFileSync(folderPath, '');
                log(green('less was generated with success'));
                resolve();
            }).catch(err => {
                log(err);
                resolve();
            });
        });
    }

    webform(name, isCombo = false, filename = 'Default.aspx') {
        const folderPath = `./pages/${name}/${filename}`;

        log(`generating webform "${name}"`);
        fileOverwrite(folderPath).then(() => {
            const netClass = folderPath.slice(2).replace(/[\/-]/g, '_');
            const buffer = fs.readFileSync(`./pages/model.aspx`);
            let fileStr = buffer.toString();

            fileStr = fileStr.replace('[className]', netClass);
            fileStr = fileStr.replace('[metaTag]', `${isCombo ? `<meta id="jsPageID" data-value="pages/${name}" />` : ''}`);
            fs.outputFileSync(folderPath, fileStr);

            const bufferCs = fs.readFileSync(`./pages/model.aspx.cs`);
            let fileStrCs = bufferCs.toString();

            fileStrCs = fileStrCs.replace('[className]', netClass.replace('.aspx', ''));
            fs.outputFileSync(`${folderPath}.cs`, fileStrCs);

            log(green('webform was generated with success'));
        }).catch(log);
    }

    async combo(name) {
        await this.page(name);
        await this.template(name);
        await this.less(name);
        await this.webform(name, true);
    }
}