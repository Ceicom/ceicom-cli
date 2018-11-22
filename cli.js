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

const { exec, spawn } = require('child_process');
function run() {
    const verification = new Verification();
    if (!verification.isProjectValid()) return;

    // exec('.\/iisexpress /?', { cwd: 'C:\/Program Files\/IIS Express\/' });
    const yarnCmd = spawn('.\/iisexpress', [`/path:${process.cwd()}`, '/port:5423', '/clr:v4.0'], { cwd: 'C:\/Program Files (x86)\/IIS Express\/' });
    // const yarnCmd = spawn('.\/iisexpress', [`/config:${process.cwd()}\/Web.config`], { cwd: 'C:\/Program Files (x86)\/IIS Express\/' });
    // Nome de arquivo: \\?\c:\Users\Jessica-PC\teste.com.br\Web.configErro: N�o � poss�vel ler a se��o de configura��o 'system.applicationHost/sites' porque falta uma declara��o de se��o

    yarnCmd.stdout.on('data', data => logger.info(data.toString().replace(/[\n\r]/g, '') + '\n'));
}

function build() {
    const verification = new Verification();
    if (!verification.isProjectValid()) return;

    console.log(':)');
    // C:\Windows\Microsoft.NET\Framework\v4.0.30319\aspnet_compiler.exe -v /univiasoft.com.br -p C:\Users\Keller\AppData\Local\Temp\WebSitePublish\univiasoft.com.br-303842288\obj\Debug\AspnetCompileMerge\Source -u -fixednames C:\Users\Keller\AppData\Local\Temp\WebSitePublish\univiasoft.com.br-303842288\obj\Debug\AspnetCompileMerge\TempBuildDir 
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

// Run Project
commander.command('run')
    .alias('r')
    .description(`run the actual project`)
    .action(run);

// Build Project
commander.command('build')
    .alias('b')
    .description(`build the actual project`)
    .action(build);

// Commands that not exist
commander.command('*')
    .action(env => logger.warn(`command "${env}" not exist, use --help for avaible commands`));

commander.parse(process.argv);