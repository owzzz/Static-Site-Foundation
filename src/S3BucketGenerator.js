const AWS = require('aws-sdk');

class S3BucketGenerator {
	constructor(bucketName, bucketKey) {
		this.bucketName = bucketName;
		this.bucketKey = bucketKey;
		this.s3Instance = new AWS.S3();

		this.setS3(this.bucketName).then((bucket) => {
			console.log('bucket is available', bucket);
		}).catch((err) => this.errorHandler(err));
	}

	setS3(bucketName) {
		return new Promise((resolve, reject) => {
			this.bucketExists(bucketName).then(bucket => {
				if(bucket.length) {
					this.createS3Site(bucketName)
						.then(() => resolve(bucket))
						.catch(err => this.errorHandler(err));
				} else {
					this.createBucket(bucketName)
						.then(bucket => this.createS3Site(bucket))
						.then(bucket => resolve(bucket))
						.catch(err => this.errorHandler(err));
				}
			}).catch((err) => this.errorHandler(err));
		});
	}

	createS3Site(bucketName) {
		console.log(bucketName);
		return new Promise((resolve, reject) => {
			this.s3Instance.putBucketWebsite({
					Bucket: bucketName,
				  WebsiteConfiguration: {
				    ErrorDocument: {
				      Key: '404.html'
				    },
				    IndexDocument: {
				      Suffix: 'index.html'
				    },
				  }
				}, (err, data) => (err) ? reject(err) : resolve(data));
		});
	}

	bucketExists(bucketName) {
		return new Promise((resolve, reject) => {
			this.s3Instance.listBuckets((err, data) => (err) ? reject(err) : resolve(data.Buckets.filter((bucket) => (bucket.Name === bucketName))));
		})
	}

	createBucket(bucketName = `bucket-${Date.now()}`) {
		return new Promise((resolve, reject) => {
			this.s3Instance.createBucket({
				Bucket: bucketName,
			}, (err, data) => (err) ? reject(err) : resolve(data));
		});
	}

	errorHandler(err) {
		console.log('Error Handler');
		console.log('-------------');
		console.log(err);
	}
}

module.exports = new S3BucketGenerator('bucket-1507928770554');

