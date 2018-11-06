module.exports = function treatFileName(name) {
    if (name.indexOf('/') < 0) return name;
    const arrPath = name.match(/\w+\//g).map(item => item.replace('/', ''));
    return arrPath.join('/');
}