const hbs = require('handlebars');
const fs = require('fs');

class Templater {
  constructor(templatePath, data = {}) {
    this.templatePath = templatePath;
    this.data = data;

    console.log('initialise templater', this);
    console.log('templatepath', this.templatePath);
    console.log('data', data);
  }

  generateTemplate() {
    console.log('fetching template');
    return this.fetchTemplate(this.templatePath).then((html) => {
      console.log('html found', html);
      return this.populatedTemplate = this.compileTemplate(this.parseTemplate(html), this.data);
    }).catch((err) => console.log('error fetching template', err));
  }

  fetchTemplate(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, file) => {
        if (err) reject(err);
        resolve(file.toString('utf8'));
      });
    })
  }

  parseTemplate(html) {
    return hbs.compile(html);
  }

  compileTemplate(template, data) {
    return template(data);
  }
}

module.exports = Templater;
