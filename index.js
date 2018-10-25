#! /usr/bin/env node

// Modules
const fs = require('fs-extra');
const commander = require('commander');
const downloadRepo = require('download-git-repo');
const { exec, spawn } = require('child_process');

// Classes
const Generator = require('./generator');

const config = {
    gitDomain: 'github',
    boilerplateRepo: 'Dimebag03/html_boilerplate',
    jsInitFolder: './dev/js',
    avaibleTypes: ['component', 'page', 'template', 'ux', 'less', 'webform', 'combo']
};

function generateFiles(type, value) {
    if (!config.avaibleTypes.includes(type)) {
        console.log('you need to pass a valid type!');
        console.log(`avaible types: ${config.avaibleTypes.join(', ')}`);
        return;
    }

    const generator = new Generator(config);
    generator[type](value);
}

function newProject(projectName) {
    if (!projectName) {
        console.log('you need to pass a project name');
        return;
    }

    const exists = fs.pathExistsSync(`./${projectName}`);
    if (exists) {
        console.log('alredy exist a project with the given name');
        return;
    }

    console.log('downloading git repository...');
    downloadRepo(config.boilerplateRepo, `./${projectName}`, err => {
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

// Version
commander.version('0.0.1', '-v, --version');

// Start a new project
commander.command('new <projectName>')
    .alias('n')
    .description('start a new project')
    .action(newProject);

// Generate Things
commander.command('generate <type> <value>')
    .alias('g')
    .description(`generate new files, avaible options: ${config.avaibleTypes.join(', ')}`)
    .action(generateFiles);

// Commands that not exist
commander.command('*')
    .action(env => console.log(`command "${env}" not exist, use --help for avaible commands`));

commander.parse(process.argv);