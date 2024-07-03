const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
// database Name
const dbName = 'upload_file';

const express = require('express')
const multer  = require('multer');

const app = express()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file)
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {

      const fileUploadName = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, fileUploadName + '-' + file.originalname)
    }
  })
  const upload = multer({ storage : storage })


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Async function 
async function insertFile(filePath) {
  const client = new MongoClient(url);

  try {
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection('upload');

    await collection.insertOne({ fileUpload: filePath });
    res.send('uploaded');
  } 
  catch (error) {
    // console.error('Error');
}
  finally {
    await client.close();
  }
}

app.post('/upload', upload.single('fileUpload'),  async function(req, res) {
    try{
      await insertFile(req.file.path);
      res.send('Image Uploaded');
    }catch (error) {
        console.log('error')
    }
  });
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/templates/upload.html');
  });

app.listen(3000)