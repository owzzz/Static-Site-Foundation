const Contentful = require('contentful');
const Config = require('../config').contentful;

class ContentfulAdapter {
	constructor(Config) {
		this.client = Contentful.createClient({
			space: Config.spaceId,
			accessToken: Config.accessToken
		});

		this.syncContent().then(data => {
			console.log('data', data.nextSyncToken);
		}).catch(err => {
			console.log('error', err);
		})
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

let ContentfulInstance = new ContentfulAdapter(Config);

