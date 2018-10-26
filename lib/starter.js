const fs = require('fs-extra');
const downloadRepo = require('download-git-repo');
const { exec, spawn } = require('child_process');

const logger = require('./logger');

module.exports = class Starter {
    constructor(config) {
        this.config = config;
    }

    newProject(projectName) {
        const { boilerplateRepo } = this.config;
        const exists = fs.pathExistsSync(`./${projectName}`);
        if (exists) {
            logger.warn('alredy exist a project with the given name');
            return;
        }

        logger.proces('downloading git repository...');
        downloadRepo(boilerplateRepo, `./${projectName}`, err => {
            if (err) throw err;
            logger.success('finished download');
            logger.proces('starting yarn install...');

            const yarnCmd = spawn('yarn.cmd', ['install'], { cwd: `./${projectName}` });

            yarnCmd.stdout.on('data', data => logger.info(data.toString().replace(/[\n\r]/g, '')));

            yarnCmd.on('close', () => {
                fs.ensureDirSync(`./${projectName}/arquivos`);
                exec('attrib +h "node_modules"', { cwd: `./${projectName}` });
                exec('attrib +h "arquivos"', { cwd: `./${projectName}` });

                logger.success('\nprocess finish!');
                logger.info(`use the command "cd ${projectName}" to access your project`);
                logger.info('you also will need to start your git repository (git init)');
            });
        });
    }

}