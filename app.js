var { clearConsole } = require('./utils');
var Read = require('./read');

class App {
    constructor(lang, onClose) {
        this.language = lang;
        this.onClose = onClose;
        clearConsole();
        this.bindContext();
        this.help();
        this.reading = null;
        this.supportedCommands = {
            'HELP': this.help, 
            'QUIT': this.quit, 
            'READ': this.read, 
            'Q': this.quit, 
            'H': this.help,
        };
    }

    bindContext() {
        this.quit = this.quit.bind(this);
        this.onInput = this.onInput.bind(this);
        this.getReadingInstance = this.getReadingInstance.bind(this);
        this.read = this.read.bind(this);
        this.onArticleReady = this.onArticleReady.bind(this);
        this.onEnter = this.onEnter.bind(this);
    }
    
    onInput(i) {
        if (i.length === 0) this.onEnter();
        const input = i.toString().trim();
        if (!input) return;
        var [command, ...params] = input.split(' ');
        if (!command) return;
        command = command.toUpperCase();
        this.onCommand(command, params);
    }

    quit() {
        clearConsole();
        console.log('Thank you for choosing us! Hope to see you soon.')
        this.onClose();
    }

    help() {
        console.log(
            `This application supports the following commands:-
            READ <article>: READ followed by article name. It reads the article from wikipedia in your chosen language.
            QUIT(q): Will stop the application.
            HELP(h): Will display the supported commands.
            `
        );
    }

    onCommand(command, params) {
        if(Object.keys(this.supportedCommands).indexOf(command) === -1) {
            this.help();
            console.log(`${command} Command not supported`);
            return;
        }
        console.log('command', command);
        this.supportedCommands[command](params);
    }

    getReadingInstance(articleName) {
        if (this.reading) return this.reading;
        this.reading = new Read(articleName, this.language, this.onArticleReady);
    }

    async read(params) {
        const articleName = params.length ? params.join('_') : '';
        if (!articleName) {
            console.log('Please reissue the command `READ` followed by the article name you wish to read');
            return;
        }
        this.getReadingInstance(articleName);
    }

    onEnter() {
        if (this.reading && this.reading.articleFound) {
            console.log(this.reading.readNextPara());
            console.log('\n');
        }
    }

    onArticleReady() {
        if (this.reading && this.reading.articleFound) {
            console.log('Please use Enter/Return key to load next para of the article \n\n');
            console.log(this.reading.readNextPara());
            console.log('\n');
        }
    }
};


module.exports = App;