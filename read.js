const fetch = require('node-fetch');
var DomParser = require('dom-parser');
var { loadingStop, loadingStart } = require('./utils');
var parser = new DomParser();

class Read {
    constructor(articleName, lang, onReady) {
        this.articleName = articleName;
        this.language = lang;
        this.articleURL = `https://${this.language}.wikipedia.org/wiki/${this.articleName}`;
        this.isReading = false;
        this.readingParaNumber = 0;
        this.paras = [];
        this.parseArticleParagraphs = this.parseArticleParagraphs.bind(this);
        this.readNextPara = this.readNextPara.bind(this);
        this.getArticle(onReady);
        this.articleFound = false;
    }

    async getArticle(onReady) {
        const articleParsedparas = await this.readArticle();
        if (!articleParsedparas) {
            console.log('Article not found. Please try with a different name');
        }
        onReady();
    }

    readArticle() {
        return fetch(this.articleURL)
            .then(r => {
                if(!r.ok) return false;
                return r.text();
            })
            .then(this.parseArticleParagraphs)
            .catch(e => {
                console.log('Error reading article:', e.message);
                return false;
            });
    }

    parseArticleParagraphs(html) {
        if (!html) {
            return false;
        }
        this.articleFound = true;
        var dom = parser.parseFromString(html);
        this.paras = dom.getElementsByTagName('p');
        return this.paras;
    }

    readNextPara() {
        this.isReading = true;
        if (this.readingParaNumber === this.paras.length) {
            console.log(`\n--- end of article ---\n`);
            this.articleFound = false;
            return;
        }
        const content = this.paras[this.readingParaNumber++].textContent.trim();
        if (!content) return this.readNextPara();
        return content;
    }

    stopReadingPara() {
        this.isReading = false;
    }
}

module.exports = Read;