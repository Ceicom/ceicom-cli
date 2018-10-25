const fs = require('fs-extra');
const downloadRepo = require('download-git-repo');
const { exec, spawn } = require('child_process');
const { blue, green, yellow } = require('chalk');
const log = console.log;

module.exports = class Starter {
    constructor(config) {
        this.config = config;
    }

    newProject(projectName) {
        const { boilerplateRepo } = this.config;
        const exists = fs.pathExistsSync(`./${projectName}`);
        if (exists) {
            log(yellow('alredy exist a project with the given name'));
            return;
        }

        log(blue('downloading git repository...'));
        downloadRepo(boilerplateRepo, `./${projectName}`, err => {
            if (err) throw err;
            log(green('finished download'));
            log(blue('starting yarn install...'));

            const yarnCmd = spawn('yarn.cmd', ['install'], { cwd: `./${projectName}` });

            yarnCmd.stdout.on('data', data => log(data.toString().replace(/[\n\r]/g, '')));

            yarnCmd.on('close', () => {
                fs.ensureDirSync(`./${projectName}/arquivos`);
                exec('attrib +h "node_modules"', { cwd: `./${projectName}` });
                exec('attrib +h "arquivos"', { cwd: `./${projectName}` });

                log(green('\nprocess finish!'));
                log(`use the command "cd ${projectName}" to access your project`);
                log('you also will need to start your git repository (git init)');
            });
        });
    }

}