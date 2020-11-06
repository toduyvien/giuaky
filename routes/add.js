var express = require('express');
var router = express.Router();
const multer = require('multer')

const { v4: uuidv4 } = require('uuid')
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
    endpoint: "http://dynamodb.us-east-2.amazonaws.com"
})
const s3 = new aws.S3({
    endpoint: process.env.S3_ENDPOINT
})
router.get('/', function(req, res) {
    res.render('add', { title: 'Express' });
});
const storage = multer.memoryStorage({
    destination: (req, file, callback) => {
        callback(null, '')
    }
})
const upload = multer({ storage }).single('image')
router.post('/', upload, (req, res) => {
    //console.log(req.file)
    let myFile = req.file.originalname.split('.')
    let fileType = myFile[myFile.length - 1]

    let s3param = {
        Bucket: "sinhvien1234",
        Key: uuidv4() + '.' + fileType,
        Body: req.file.buffer
    }
    s3.upload(s3param, (err, data) => {
        if (err) console.log(err)
        else {
            let param = {
                TableName: "sinhvien",
                Item: {
                    "masinhvien": uuidv4(),
                    "ten": req.body.ten,
                    "sdt": req.body.sdt,
                    "avatar": data.Location
                }
            }
            dynamoDB.put(param, (err, data) => {
                if (err) console.log("loi them", err)
                else console.log("thanh cong ")
            })
        }
    })

    res.render('add')
})

module.exports = router;