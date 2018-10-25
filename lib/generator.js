const fs = require('fs-extra');

const { capitalize, fileOverwrite } = require('./utils');

module.exports = class Generator {
    constructor(config) {
        this.config = config;
    }

    page(name) {
        return new Promise(resolve => {
            const { jsInitFolder } = this.config;
            const folderPath = `${jsInitFolder}/pages/${name}.js`;

            console.log(`generating page "${name}"`);
            fileOverwrite(folderPath).then(() => {
                const buffer = fs.readFileSync(`${jsInitFolder}/pages/model.js`);
                let fileStr = buffer.toString();

                fileStr = fileStr.replace(/\[name\]/g, name);
                fileStr = fileStr.replace('getData', `getData${capitalize(name)}`);
                fs.writeFileSync(folderPath, fileStr);

                console.log('page was generated with success');
                resolve();
            }).catch(err => {
                console.log(err);
                resolve();
            });
        });
    }

    template(name) {
        return new Promise(resolve => {
            const { jsInitFolder } = this.config;
            const folderPath = `${jsInitFolder}/templates/${name}.js`;

            console.log(`generating template "${name}"`);
            fileOverwrite(folderPath).then(() => {
                const buffer = fs.readFileSync(`${jsInitFolder}/templates/model.js`);
                let fileStr = buffer.toString();

                fileStr = fileStr.replace(/\[name\]/g, name);
                fileStr = fileStr.replace('getData', `getData${capitalize(name)}`);
                fs.writeFileSync(folderPath, fileStr);

                console.log('template was generated with success');
                resolve();
            }).catch(err => {
                console.log(err);
                resolve();
            });
        });
    }

    less(name) {
        return new Promise(resolve => {
            const folderPath = `./dev/less/page/${name}.less`;

            console.log(`generating less "${name}"`);
            fileOverwrite(folderPath).then(() => {
                fs.outputFileSync(folderPath, '');
                console.log('less was generated with success');
                resolve();
            }).catch(err => {
                console.log(err);
                resolve();
            });
        });
    }

    webform(name, isCombo = false) {
        const folderPath = `./pages/${name}/Default.aspx`;

        console.log(`generating webform "${name}"`);
        fileOverwrite(folderPath).then(() => {
            let netClass = folderPath.slice(2).split(/[\/-]/g);
            netClass = netClass.join('_');

            const buffer = fs.readFileSync(`./pages/model.aspx`);
            let fileStr = buffer.toString();

            fileStr = fileStr.replace('[className]', netClass);
            fileStr = fileStr.replace('[metaTag]', `${isCombo ? `<meta id="jsPageID" data-value="pages/${name}" />` : ''}`);
            fs.outputFileSync(folderPath, fileStr);

            const bufferCs = fs.readFileSync(`./pages/model.aspx.cs`);
            let fileStrCs = bufferCs.toString();

            fileStrCs = fileStrCs.replace('[className]', netClass.replace('.aspx', ''));
            fs.outputFileSync(`${folderPath}.cs`, fileStrCs);

            console.log('webform was generated with success');
        }).catch(console.log);
    }

    async combo(name) {
        await this.page(name);
        await this.template(name);
        await this.less(name);
        await this.webform(name, true);
    }
}