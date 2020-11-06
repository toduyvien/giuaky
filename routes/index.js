var express = require('express');
var router = express.Router();
const aws = require('aws-sdk')
require('dotenv').config()
let config = {
        "region": "us-east-2",
        "accessKeyId": process.env.AWSAccessKeyId,
        "secretAccessKey": process.env.AWSSecretKey
    }
    /* GET home page. */
aws.config.update(config)
const dynamoDB = new aws.DynamoDB.DocumentClient({
        endpoint: process.env.DYNAMO_ENDPOINT
    })
    /* GET home page. */

router.get('/', function(req, res) {
    let param = {
        TableName: 'sinhvien'
    }
    dynamoDB.scan(param, function(err, data) {
        if (err) console.log(err)
        else res.render('index', { AllSinhVien: data.Items })
    })
});



module.exports = router;