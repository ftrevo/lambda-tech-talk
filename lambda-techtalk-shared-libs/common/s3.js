// --------------- Import de dependências --------------- //
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports.insert = (fileString, fileName) => {
    let contents = fileString.split('base64,');
    contents[0] = contents[0].replace('data:', '').replace(';', '').trim();

    return s3.putObject(
        {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: new Buffer(contents[1], 'base64'),
            ContentType: contents[0],
            ACL: 'public-read'
        }
    ).promise();
};

module.exports.remove = (fileName) => {
    return s3.deleteObject(
        {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName
        }
    ).promise();
};
