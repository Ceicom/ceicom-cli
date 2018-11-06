#! /usr/bin/env node

const commander = require('commander');
const pkgJson = require('../package.json');

// Check Version
commander.version(pkgJson.version, '-v, --version');

// Start a new project
commander.command('new <projectName>')
    .alias('n')
    .description('start a new project')
    .action(newProject);

// Generate blueprints
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