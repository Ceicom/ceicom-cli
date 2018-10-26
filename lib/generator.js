const logger = require('./logger');
const {capitalizeFileName} = require('./utils');
const Task = require('./task');

module.exports = class Generator {
    constructor(envConfig, options) {
        this.config = envConfig;
        this.options = options;
    }

    page() {
        const { name, options } = this.options;
        const { jsInitFolder } = this.config;
        const modelPath = `${jsInitFolder}/pages/model.js`;
        const folderPath = `${jsInitFolder}/pages/${name}.js`;
        const task = new Task({ folderPath, modelPath, ...this.options });

        logger.info(`generating page "${name}"`);
        return task.runTaks()
            .then(() => {
                logger.success('page was generated with success');
                if (options.template) this.template();
            }).catch(err => logger.error(err));
    }

    template() {
        const { name } = this.options;
        const { jsInitFolder } = this.config;
        const modelPath = `${jsInitFolder}/templates/model.js`;
        const folderPath = `${jsInitFolder}/templates/${name}.js`;
        const task = new Task({ folderPath, modelPath, ...this.options });

        logger.info(`generating template "${name}"`);
        return task.runTaks()
            .then(() => logger.success('template was generated with success'))
            .catch(err => logger.error(err));
    }

    less() {
        const { name } = this.options
        const folderPath = `./dev/less/page/${name}.less`;
        const task = new Task({ folderPath, ...this.options });

        logger.info(`generating less "${name}"`);
        return task.runTaks()
            .then(() => logger.success('less was generated with success'))
            .catch(err => logger.error(err));
    }

    _webformcs() {
        let { name } = this.options
        name = name.slice(-4) !== 'aspx' ? name.concat('.aspx.cs') : name;
        name = capitalizeFileName(name);
        const folderPath = `./pages/${name}`;
        const modelPath = `./pages/model.aspx.cs`;
        const taskAspxCs = new Task({ modelPath, folderPath, ...this.options });

        logger.info(`generating .aspx.cs "${name}"`);
        return taskAspxCs.runTaks()
            .then(() => logger.success('.aspx.cs was generated with success'))
            .catch(err => logger.error(err));
    }

    webform(isCombo) {
        let { name } = this.options
        name = name.slice(-4) !== 'aspx' ? name.concat('.aspx') : name;
        name = capitalizeFileName(name);
        const folderPath = `./pages/${name}`;
        const modelPath = `./pages/model.aspx`;
        const taskAspx = new Task({ modelPath, folderPath, isCombo, ...this.options });

        logger.info(`generating .aspx "${name}"`);
        return taskAspx.runTaks()
            .then(() => {
                logger.success('.aspx was generated with success');
                this._webformcs();
            }).catch(err => logger.error(err));
    }

    async combo(name) {
        await this.page(name);
        await this.template(name);
        await this.less(name);
        await this.webform(name, true);
    }
}