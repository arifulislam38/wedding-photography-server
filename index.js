const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());


const uri = process.env.DB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const serviceCollection = client.db('wedding-services').collection('services');

const reviewCollection = client.db('wedding-services').collection('reviews');

async function run() {
  try {
    await client.connect();

  } catch(error) {
    console.log(error.name, error.message)
  }
}
run();





app.listen(port, () => console.log('node server is running'))