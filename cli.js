#! /usr/bin/env node

// Modules
const commander = require('commander');
const { red } = require('chalk');

// Classes
const Starter = require('./lib/starter');
const Generator = require('./lib/generator');
const Verification = require('./lib/verification');
const { log } = require('./lib/utils');
const logger = require('./lib/logger');

const config = {
    gitDomain: 'github',
    // TODO: change to Ceicom/html_boilerplate when finished
    boilerplateRepo: 'Dimebag03/html_boilerplate',
    jsInitFolder: './dev/js',
    avaibleTypes: ['page', 'template', 'less', 'webform', 'combo']
};

function newProject(projectName) {
    if (!projectName) {
        logger.warn('you need to pass a project name!');
        return;
    }

    const starter = new Starter(config);
    starter.newProject(projectName);
}

function generateFiles(type, name, options) {
    const verification = new Verification();
    if (!verification.isProjectValid()) return;

    if (!config.avaibleTypes.includes(type)) {
        logger.warn('you need to pass a valid type!');
        logger.info(`avaible types: ${config.avaibleTypes.join(', ')}`);
        return;
    }

    const generator = new Generator(config, {
        type, name, options
    });

    generator[type]();
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