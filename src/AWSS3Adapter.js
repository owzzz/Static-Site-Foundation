const S3 = require('aws-sdk/clients/s3');

module.exports = class S3BucketGenerator {
	constructor(config) {
		this.bucketName = config.bucketName;
		this.bucketKey = config.bucketKey;
		this.s3Instance = new S3();

		// If no bucket name passed in, create one
		if(!this.bucketName) {
			this.createBucket().then(bucket => {
				this.bucketName = bucket.Name;
			});
		}

		// With bucket setup S3 static site
		this.setS3(this.bucketName).then((bucket) => {
			console.log('bucket is available', bucket);
		}).catch((err) => this.errorHandler(err));
	}
	// Setup S3 bucket and configure static hosting policy
	setS3(bucketName, config) {
		return new Promise((resolve, reject) => {
			this.getBuckets(bucketName)
				.then(buckets => this.bucketExists(buckets, bucketName))
				.then(bucket => {
					if(bucket.length) {
						this.createS3Site(bucketName, config.websiteConfiguration)
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
	// Create S3 Static site bucket
	createS3Site(bucketName, configuration) {
		return new Promise((resolve, reject) => {
			this.s3Instance.putBucketWebsite({
					Bucket: bucketName,
				  WebsiteConfiguration: configuration
				}, (err, data) => (err) ? reject(err) : resolve(data));
		});
	}
	// Check if a bucket exists in a list of passed buckets
	bucketExists(buckets, bucketName) {
		return buckets.filter((bucket) => (bucket.Name === bucketName));
	}
	// Get all buckets accosciated with AWS account
	getBuckets(bucketName) {
		return new Promise((resolve, reject) => {
			this.s3Instance.listBuckets((err, data) => (err) ? reject(err) : resolve(data));
		})
	}
	// Create S3 Bucket
	createBucket(bucketName = `bucket-${Date.now()}`) {
		return new Promise((resolve, reject) => {
			this.s3Instance.createBucket({
				Bucket: bucketName,
			}, (err, data) => (err) ? reject(err) : resolve(data));
		});
	}
	// Put file or asset in bucket (current instance)
	putObject(params = {}) {
		return new Promise((resolve, reject) => {
			return this.s3Instance.putObject(params, (err, data) => (err) ? reject(err) : resolve(data));
		});
	}
	// Error handler
	errorHandler(err) {
		console.log('Error Handler');
		console.log('-------------');
		console.log(err);
	}
}

