const fs = require('fs-extra');
const downloadRepo = require('download-git-repo');
const { exec, spawn } = require('child_process');
const logger = require('../logger');

module.exports = class New {
    constructor(projectName) {
        this.projectName = projectName;
    }

    beforeRun() {
        const exists = fs.pathExistsSync(`./${this.projectName}`);
        if (exists) {
            logger.warn('alredy exist a project with the given name');
            return;
        }
    }

    run() {
        this.beforeRun();
        logger.proces('downloading git repository...');
        downloadRepo(boilerplateRepo, `./${this.projectName}`, err => {
            if (err) throw err;

            logger.success('finished download');
            logger.proces('starting yarn install...');
            const yarnCmd = spawn('yarn.cmd', ['install'], { cwd: `./${this.projectName}` });

            yarnCmd.stdout.on('data', data => logger.info(data.toString().replace(/[\n\r]/g, '')));
            yarnCmd.on('close', this.afterDownload());
        });
    }

    afterDownload() {
        fs.ensureDirSync(`./${this.projectName}/arquivos`);
        exec('attrib +h "node_modules"', { cwd: `./${this.projectName}` });
        exec('attrib +h "arquivos"', { cwd: `./${this.projectName}` });

        logger.success('\nprocess finish!');
        logger.info(`use the command "cd ${this.projectName}" to access your project`);
        logger.info('you also will need to start your git repository (git init)');
    }
}