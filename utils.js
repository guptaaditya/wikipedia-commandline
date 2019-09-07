const fetch = require('node-fetch');

function isLanguageSupported(lang) {
    const url = `https://${lang}.wikipedia.org`;
    return fetch(url).then(r => {
        if (r.ok) {
            return true;
        }
        return false;
    }).catch(e => {
        return false;
    });
}

function clearConsole() {
    console.clear();
}

function loadingStart() {
    console.log('Please wait \n');
    const interval = setInterval(console.log, 500, '.');
    //force stop loader after 5 seconds
    setTimeout(loadingStop, 5000, interval);
}

function loadingStop(interval) {
    clearInterval(interval);
}

function debug(...args) {
    console.log(...args);
}

function output(message) {
    process.stdout.write(message);
}

module.exports = {
    isLanguageSupported,
    clearConsole,
    loadingStart,
    loadingStop,
    log: {
        debug,
        output,
    }
};