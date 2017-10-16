const hbs = require('handlebars');

module.exports = class Templater {
	constructor(html, data = {}) {
		this.html = html;
		this.data = data;
		this.template = this.parseTemplate(this.html);

		this.compileTemplate(this.template, this.data);
	}

	parseTemplate(html) {
		return hbs.compile(html);
	}

	compileTemplate(template, data) {
		return template(data);
	}
}