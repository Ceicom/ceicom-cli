const fs = require('fs-extra');
const logger = require('./logger');
const { capitalizeFileName, treatFileName } = require('./utils');
const Task = require('./task');

module.exports = class Generate {
    constructor(config) {
        this.config = config;
    }
}