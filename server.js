var express = require('express');
const csvtojson = require("csvtojson");
const MongoClient = require("mongodb").MongoClient;
var app = express();
const path = require('path');
const multer = require("multer");
const databbaseUrl="mongodb://localhost:27017/";
const databaseName="assigment_db"
const databasecollection = "csvrecord";
var db = null;
MongoClient.connect(databbaseUrl, function(err, client) {
    if(err) { console.error(err) }
    db = client.db(databaseName)
})
app.use(express.static(path.join(__dirname, 'build')));
const storage = multer.diskStorage({
   destination: "./public/uploads/",
   filename: function (req, file, cb) {
      cb(null, file.originalname);
   }
});
const upload = multer({
   storage: storage,
}).single("myCsvFile");

app.get('/', function (req, res) {
   res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
});

app.post('/upload', function (req, res) {
   upload(req, res, (err) => {
      if (!err)
         csvtojson()
         .fromFile("./public/uploads/"+req.file.filename)
         .then(csvData => {
           // console.log(csvData);
            db.collection(databasecollection).insertMany(csvData, (err, res) => {
               if (err) throw err;        
            console.log(`Inserted Data : ${res.insertedCount} rows`);
          });
         })
      return res.send(200).end();
   });
});

app.post('/fetchtablerecord', function (req, res) {
   db.collection(databasecollection).find({}).toArray(function(err, docs) {
      if(err) { console.error(err) }
      res.send(JSON.stringify(docs))
  })
});
app.listen(8080, () => console.log('App Runing Port  8080!'));