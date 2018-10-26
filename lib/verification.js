const fs = require('fs-extra');
const logger = require('./logger');

module.exports = class Verification {
    isProjectValid() {
        try {
            const buffer = fs.readFileSync('./package.json');
            const json = JSON.parse(buffer.toString());

            if (json.name !== 'ceicom_boilerplate') {
                logger.error('this project is not appear to be a ceicom_boilerplate project!');
                return false;
            }

            // TODO: descomment when finished
            // if (json.version !== '1.0.1') {
            //     logger.error('this project is not in an accepted version!');
            //     return false;
            // }

            return true;
        } catch (err) {
            if (err.code === 'ENOENT') {
                logger.error('package.json not found, verify if this project is a valid one');
                return false;
            } else {
                logger.error('error:', err);
            }
            return false;
        }
    }
}