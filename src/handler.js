
module.exports.sync = (event, context, callback) => {
  const Config = require('../config');
  const ContentfulAdapter = require('../src/ContentfulAdapter');
  const S3Adapter = require('../src/AWSS3Adapter');
  const Templater = require('../src/Templater');
  const fs = require('fs');
  console.log(event);
  const content = {
    "sys": {
      "space": {
        "sys": {
          "type": "Link",
          "linkType": "Space",
          "id": "jciqgcuub56q"
        }
      },
      "id": "6TuNcbRQR2C8G400iOwWey",
      "type": "Entry",
      "createdAt": "2017-10-13T23:30:55.613Z",
      "updatedAt": "2017-10-15T15:18:45.181Z",
      "createdBy": {
        "sys": {
          "type": "Link",
          "linkType": "User",
          "id": "61A9BTh726FFMvvTiexLUw"
        }
      },
      "updatedBy": {
        "sys": {
          "type": "Link",
          "linkType": "User",
          "id": "61A9BTh726FFMvvTiexLUw"
        }
      },
      "publishedCounter": 2,
      "version": 18,
      "publishedBy": {
        "sys": {
          "type": "Link",
          "linkType": "User",
          "id": "61A9BTh726FFMvvTiexLUw"
        }
      },
      "publishedVersion": 17,
      "firstPublishedAt": "2017-10-13T23:31:07.908Z",
      "publishedAt": "2017-10-15T15:18:45.181Z",
      "contentType": {
        "sys": {
          "type": "Link",
          "linkType": "ContentType",
          "id": "company"
        }
      }
    },
    "fields": {
      "title": {
        "en-US": "Area 51"
      },
      "subtitle": {
        "en-US": "A subtitle goes here"
      },
      "template": {
        "en-US": "home"
      }
    }
  };

  const template = null;

  fs.readFile('./templates/home.html', (err, file) => {
    if (err) throw err;
    console.log('FILE CALLED', typeof file, file.toString('utf8'));
    console.log('CONTENT CALLED', content);

    let Template = new Templater(file.toString('utf8'), content);
    let S3 = new S3Adapter(Config.S3);

        S3.putObject({Bucket: S3.bucketName, Body: Template, Key: 'Home-Page'}).then((data) => {
          const response = {
            statusCode: 200,
            body: JSON.stringify({
              message: 'Home Page Created/Updated',
              input: data,
            }),
          };

          callback(null, response);
        });
  });

  // Content has changed
  // Sync content and get delta
  // Take data and run through template compiler
  // Save in S3




  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
