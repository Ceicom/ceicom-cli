const fs = require('fs-extra');
const downloadRepo = require('download-git-repo');
const { exec, spawn } = require('child_process');

module.exports = class Starter {
    constructor(config) {
        this.config = config;
    }

    newProject(projectName) {
        const { boilerplateRepo } = this.config;
        const exists = fs.pathExistsSync(`./${projectName}`);
        if (exists) {
            console.log('alredy exist a project with the given name');
            return;
        }

        console.log('downloading git repository...');
        downloadRepo(boilerplateRepo, `./${projectName}`, err => {
            if (err) throw err;
            console.log('finished download');
            console.log('starting yarn install...');

            const yarnCmd = spawn('yarn.cmd', ['install'], { cwd: `./${projectName}` });

            yarnCmd.stdout.on('data', data => console.log(data.toString().replace(/[\n\r]/g, '')));

            yarnCmd.on('close', () => {
                fs.ensureDirSync(`./${projectName}/arquivos`);
                exec('attrib +h "node_modules"', { cwd: `./${projectName}` });
                exec('attrib +h "arquivos"', { cwd: `./${projectName}` });

                console.log('\nprocess finish!');
                console.log(`use the command "cd ${projectName}" to access your project`);
                console.log('you also will need to start your git repository (git init)');
            });
        });
    }

}