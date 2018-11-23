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

const fs = require('fs-extra');
const { exec, spawn } = require('child_process');
function run() {
    const verification = new Verification();
    if (!verification.isProjectValid()) return;

    // exec('.\/iisexpress /?', { cwd: 'C:\/Program Files\/IIS Express\/' });
    const yarnCmd = spawn('.\/iisexpress', [`/path:${process.cwd()}`, '/port:5423', '/clr:v4.0'], { cwd: 'C:\/Program Files (x86)\/IIS Express\/' });
    // const yarnCmd = spawn('.\/iisexpress', [`/config:${process.cwd()}\/Web.config`], { cwd: 'C:\/Program Files (x86)\/IIS Express\/' });
    // Nome de arquivo: \\?\c:\Users\Jessica-PC\teste.com.br\Web.configErro: N�o � poss�vel ler a se��o de configura��o 'system.applicationHost/sites' porque falta uma declara��o de se��o

    yarnCmd.stdout.on('data', data => logger.info(data.toString().replace(/[\n\r]/g, '')));
}

function getDirs(path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, items) => {
            if (err) reject(err);
            let arr = [];
            for (let i = 0; i < items.length; i++) {
                if (!fs.lstatSync(`${path}/${items[i]}`).isDirectory()) continue;
                arr.push(items[i]);
            }
            resolve(arr);
        });
    });
}

function build() {
    const verification = new Verification();
    if (!verification.isProjectValid()) return;

    const compilerPath = 'C:/Windows/Microsoft.NET/Framework';
    getDirs(compilerPath).then(data=> {
        const onlyVersion = data.filter(item => item.indexOf('v') > -1);
        logger.info(onlyVersion);
    }).catch(logger.error);

    // const yarnCmd = spawn('C:\/Windows\/Microsoft.NET\/Framework\/v4.0.30319\/aspnet_compiler.exe', ['-v', `${process.cwd()}`, '-p', `${process.cwd()}`, '-u', '-f', 'C:\/teste_compilados'], { cwd: './' });
    // yarnCmd.stdout.on('data', data => logger.info(data.toString().replace(/[\n\r]/g, '')));
    // yarnCmd.stderr.on('data', data => logger.info(`stderr: ${data}`));
    // yarnCmd.on('close', () => {
    //     logger.success('finished building');
    // });
    // C:\Windows\Microsoft.NET\Framework\v4.0.30319\aspnet_compiler.exe -v /teste.com.br -p C:\Users\Keller\AppData\Local\Temp\WebSitePublish\teste.com.br-303842288\obj\Debug\AspnetCompileMerge\Source -u -fixednames C:\Users\Keller\AppData\Local\Temp\WebSitePublish\teste.com.br-303842288\obj\Debug\AspnetCompileMerge\TempBuildDir 
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