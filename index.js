var readline = require('readline');
const App = require('./app');
const { isLanguageSupported, clearConsole, log } = require('./utils');

const lang = (process.argv[2] || 'en').toLowerCase();

(function init() {
    var startReadingLanguageInput = false;
    var stdin = process.openStdin();
    async function validateLanguageInput(lang){
        const isLanguageCodeSupported = await isLanguageSupported(lang);
        if (isLanguageCodeSupported) {
            stdin.removeAllListeners();
            startApp(lang);
        }
        else {
            clearConsole();
            log.output(`The language (${lang}) is not supported by wikipedia. Please enter a different language\n`);
            if (!startReadingLanguageInput) {
                stdin.addListener("data", (function(d){
                    const lang = d.toString().trim();
                    validateLanguageInput(lang.toLowerCase());
                }));
                startReadingLanguageInput = true;
            }
        }
    };
    validateLanguageInput(lang);
})();


function startApp(lang, stdin) {
    const app = new App(lang, function() {
        process.stdin.destroy();
    });
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    
    rl.on('line', app.onInput);
}
