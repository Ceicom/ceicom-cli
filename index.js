#! /usr/bin/env node

// Modules
const commander = require('commander');

// Classes
const Starter = require('./lib/starter');
const Generator = require('./lib/generator');

const config = {
    gitDomain: 'github',
    // TODO: change to Ceicom/html_boilerplate when finished
    boilerplateRepo: 'Dimebag03/html_boilerplate',
    jsInitFolder: './dev/js',
    avaibleTypes: ['component', 'page', 'template', 'ux', 'less', 'webform', 'combo']
};

function newProject(projectName) {
    if (!projectName) {
        console.log('you need to pass a project name!');
        return;
    }

    const starter = new Starter(config);
    starter.newProject(projectName);
}

function generateFiles(type, value) {
    if (!config.avaibleTypes.includes(type)) {
        console.log('you need to pass a valid type!');
        console.log(`avaible types: ${config.avaibleTypes.join(', ')}`);
        return;
    }

    const generator = new Generator(config);
    generator[type](value);
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