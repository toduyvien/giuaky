var express = require('express');
var router = express.Router();
const aws = require('aws-sdk');
const { render } = require('../app');
require('dotenv').config()
let config = {
        "region": "us-east-2",
        "accessKeyId": process.env.AWSAccessKeyId,
        "secretAccessKey": process.env.AWSSecretKey
    }
    /* GET home page. */
aws.config.update(config)

const dynamoDB = new aws.DynamoDB.DocumentClient({
        endpoint: "http://dynamodb.us-east-2.amazonaws.com"
    })
    /* GET users listing. */
router.post('/', function(req, res) {
    let param = {
        TableName: "sinhvien",
        Key: {
            'masinhvien': req.body.masinhvien
        },
        UpdateExpression: "set ten= :tenmoi, sdt = :sdtmoi",
        ExpressionAttributeValues: {
            ':tenmoi': req.body.ten,
            ':sdtmoi': req.body.sdt
        }
    }
    dynamoDB.update(param, (err, data) => {
        if (err) console.log(err)
        else console.log('update thanh cong')
        res.redirect('../../');
    })


});
router.get('/:masinhvien', (req, res) => {
    res.render('edit', { masinhvien: req.params.masinhvien })
})
module.exports = router;