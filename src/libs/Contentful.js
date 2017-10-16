const Contentful = require('contentful');


module.exports = class ContentfulClient {
	constructor(Config) {
		this.client = Contentful.createClient({
			space: Config.spaceId,
			accessToken: Config.accessToken
		});
	}

	syncContent() {
		return this.client.sync({initial: true});
	}

	getContent() {
		return this.client.getEntries();
	}

	getContentById(id) {
		return this.client.getEntries({'sys.id': id});
	}
}

