const Config = require('./config');
const ContentfulClient = require('./libs/Contentful');
const S3Client = require('./libs/S3');
const TemplaterClient = require('./libs/Templater');
const AWS = require('aws-sdk');
const Helpers = require('./libs/helpers');


module.exports.sync = (event, context, callback) => {
  const template = new TemplaterClient('./templates/home.html', JSON.parse(event.body));

  // Generate template
  template.generateTemplate()
    .then((template) => {
      console.log('template compiled', template);
      // Instansiate S3 Client
        const S3 = new S3Client(Config.S3);

        S3.putObject({Bucket: process.env.AWS_S3_BUCKET, Body: template, Key: `${template.getContentData().fields.template['en-US']}.html`, ContentType: 'text/html'}).then((data) => {
          callback(null, {
            statusCode: 200,
            body: JSON.stringify({
              message: `${template.getContentData().fields.template['en-US']}.html Created/Updated`,
              input: data,
              event: event.body
            }),
          });

        }).catch(err => callback(err, Helpers.errorHandler(err, 'Could not store object in S3 bucket', 404)));
    })
    .catch(err => callback(err, Helpers.errorHandler(err, 'Could not generate template', 404)));

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
