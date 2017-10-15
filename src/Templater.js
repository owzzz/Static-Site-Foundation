const hbs = require('handlebars');

class Templater {
	constructor(templatePath, data = {}) {
		this.templatePath = templatePath;
		this.data = data;
	}

	parseTemplate(html) {
		return hbs.compile(html);
	}

	compileTemplate(template, data) {
		return template(data);
	}
}

console.log(Templater.parseTemplate('<h1>Title</h1>'));