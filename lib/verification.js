const fs = require('fs-extra');
const logger = require('./logger');

module.exports = class Verification {
    getVersionObj(version) {
        const arrStr = version.split('.');
        return arrStr.reduce((obj, item, index) => {
            if (index === 0) obj['major'] = Number(item);
            if (index === 1) obj['minor'] = Number(item);
            if (index === 2) obj['patch'] = Number(item);
            return obj;
        }, {});
    }

    isVersionOutdate(version1, version2) {
        const version1Obj = this.getVersionObj(version1);
        const version2Obj = this.getVersionObj(version2);

        if (version1Obj.major < version2Obj.major) return true;
        if (version1Obj.major >= version2Obj.major && version1Obj.minor < version2Obj.minor) return true;
        if (version1Obj.major >= version2Obj.major && version1Obj.minor >= version2Obj.minor && version1Obj.patch < version2Obj.patch) return true;
        return false;
    }

    isProjectValid() {
        try {
            const buffer = fs.readFileSync('./package.json');
            const json = JSON.parse(buffer.toString());

            if (json.name !== 'ceicom_boilerplate') {
                logger.error('this project is not appear to be a ceicom_boilerplate project!');
                return false;
            }

            if (this.isVersionOutdate(json.version, '1.1.0')) {
                logger.error('this project is not in an accepted version!');
                return false;
            }

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