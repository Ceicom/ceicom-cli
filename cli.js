#! /usr/bin/env node

// Modules
const commander = require('commander');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

// Classes
const pkgJson = require('./package.json');
const Starter = require('./lib/starter');
const Generator = require('./lib/generator');
const Verification = require('./lib/verification');
const logger = require('./lib/logger');

const config = {
    gitDomain: 'github',
    boilerplateRepo: 'Ceicom/html_boilerplate',
    jsInitFolder: './dev/js',
    avaibleTypes: ['page', 'template', 'less', 'webform', 'combo']
};

updateNotifier({ pkg, isGlobal: true }).notify();

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
    
    name = name.replace(/\.\w*/g, '');
    const generator = new Generator(config, {
        type, options
    });

    generator[type](name);
}

// Version
commander.version(pkgJson.version, '-v, --version');

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
    .action(env => logger.warn(`command "${env}" not exist, use --help for avaible commands`));

commander.parse(process.argv);