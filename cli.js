#! /usr/bin/env node

// Modules
const commander = require('commander');
const { red } = require('chalk');

// Classes
const Starter = require('./lib/starter');
const Generator = require('./lib/generator');
const { log } = require('./lib/utils');

const config = {
    gitDomain: 'github',
    // TODO: change to Ceicom/html_boilerplate when finished
    boilerplateRepo: 'Dimebag03/html_boilerplate',
    jsInitFolder: './dev/js',
    avaibleTypes: ['page', 'template', 'less', 'webform', 'combo']
};

function newProject(projectName) {
    if (!projectName) {
        log('you need to pass a project name!');
        return;
    }

    const starter = new Starter(config);
    starter.newProject(projectName);
}

function generateFiles(type, value, options) {
    if (!config.avaibleTypes.includes(type)) {
        log(red('you need to pass a valid type!'));
        log(`avaible types: ${config.avaibleTypes.join(', ')}`);
        return;
    }

    const generator = new Generator(config);
    if (type === 'webform') {
        generator.webform(value, false, options.filename);
        return;
    }

    if (type === 'page') {
        generator.page(value, options.template);
        return;
    }

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
    .option('--filename [filename]', 'custom webform filename')
    .option('--template', 'do template aside page')
    .description(`generate new files, avaible types: ${config.avaibleTypes.join(', ')}`)
    .action(generateFiles);

// Commands that not exist
commander.command('*')
    .action(env => log(`command "${env}" not exist, use --help for avaible commands`));

commander.parse(process.argv);