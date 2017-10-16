const Config = require('./config');
const ContentfulClient = require('./libs/Contentful');
const S3Client = require('./libs/S3');
const TemplaterClient = require('./libs/Templater');
const AWS = require('aws-sdk');
module.exports.sync = (event, context, callback) => {
  console.log('EVENT', JSON.parse(event.body));
  const template = new TemplaterClient('./templates/home.html', JSON.parse(event.body));


  // Generate template
  template.generateTemplate()
    .then((template) => {
      // Instansiate S3 Client
       const S3 = new S3Client(Config.S3);

        S3.putObject({Bucket: S3.bucketName, Body: template, Key: `${Content.fields.template['en-US']}.html`, ContentType: 'text/html'}).then((data) => {
          const response = {
            statusCode: 200,
            body: JSON.stringify({
              message: 'Home Page Created/Updated',
              input: data,
              event: event.body
            }),
          };

          const SNS = new AWS.SNS();

          SNS.publish({
              Message: 'File placed on S3',
              TopicArn: 'arn:aws:sns:us-east-1:828844078135:log-content'
          }, (err, data) => {
              if (err) {
                  console.log(err.stack);
                  return;
              }
              console.log('push sent');
              console.log('EVENT', event);
              context.done(null, 'Function Finished!');
          });

          callback(null, response);
        }).catch((err) => {
          const response = {
            statusCode: 404,
            body: JSON.stringify({
              message: 'Error Putting Object',
              error: err
            }),
          };

          callback(null, response);
        })
    })
    .catch(err => {
        const response = {
          statusCode: 404,
          body: {
            message: 'Template could not be created',
            error: err,
            event: event
          }
        };

        callback(null, response);
    })


  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
