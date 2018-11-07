const fs = require('fs-extra');
const logger = require('./logger');
const { capitalizeFileName, treatFileName } = require('./utils');
const Task = require('./task');

module.exports = class Generator {
    constructor(envConfig, options) {
        this.config = envConfig;
        this.options = options;
    }

    page(name) {
        const { options } = this.options;
        const { jsInitFolder } = this.config;
        const modelPath = `${jsInitFolder}/pages/model.js`;
        const folderPath = `${jsInitFolder}/pages/${name}.js`;
        const task = new Task({ folderPath, modelPath, ...this.options, name, type: 'page' });

        logger.info(`generating page "${name}"`);
        return task.runTaks()
            .then(() => {
                logger.success('page was generated with success');
                if (options.template) this.template();
            }).catch(err => logger.error(err));
    }

    template(name) {
        const { jsInitFolder } = this.config;
        const modelPath = `${jsInitFolder}/templates/model.js`;
        const folderPath = `${jsInitFolder}/templates/${name}.js`;
        const task = new Task({ folderPath, modelPath, ...this.options, name, type: 'template' });

        logger.info(`generating template "${name}"`);
        return task.runTaks()
            .then(() => logger.success('template was generated with success'))
            .catch(err => logger.error(err));
    }

    less(name) {
        const folderPath = `./dev/less/pages/${name}.less`;
        const task = new Task({ folderPath, ...this.options, name, type: 'less' });

        logger.info(`generating less "${name}"`);
        return task.runTaks()
            .then(() => logger.success('less was generated with success'))
            .catch(err => logger.error(err));
    }

    webform(name, isCombo) {
        name = capitalizeFileName(name);
        const folderPath = `./pages/${name}.aspx`;
        const modelPath = `./pages/model.html`;
        const task = new Task({ modelPath, folderPath, isCombo, ...this.options, name, type: 'webform' });

        logger.info(`generating .aspx "${name}"`);
        return task.runTaks()
            .then(() => {
                logger.success('.aspx was generated with success');
                this.webformcs(name);
            }).catch(err => logger.error(err));
    }

    webformcs(name) {
        name = capitalizeFileName(name);
        const folderPath = `./pages/${name}.aspx.cs`;
        const modelPath = `./pages/model.cs.html`;
        const task = new Task({ modelPath, folderPath, ...this.options, name, type: 'webform' });

        logger.info(`generating .aspx.cs "${name}"`);
        return task.runTaks()
            .then(() => logger.success('.aspx.cs was generated with success'))
            .catch(err => logger.error(err));
    }

    async combo(name) {
        const treatedName = treatFileName(name);
        if (fs.existsSync(`${this.config.jsInitFolder}/pages/${treatedName}.js`)) {
            await this.webform(name, true);
            return;
        }

        await this.page(treatedName);
        await this.template(treatedName);
        await this.less(treatedName);
        await this.webform(name, true);
    }
}