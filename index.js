const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');

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

        app.post('/jwt', (req, res) =>{
            try {
                const user = req.body;
                const token = jwt.sign(user,process.env.JWT_secret,{expiresIn:'1h'});
                res.send({
                    token,
                    success: true,
                    message: 'successfully got the token'
                });
            } catch (error) {
               res.send({
                 success: false,
                 message: error.message
               })
            }
        });

        app.get('/service', async(req, res) =>{
            try {
              const cursor = serviceCollection.find({});
              const service = await cursor.limit(3).toArray();
              res.send({
                success: true,
                message : `Successfully got the service`,
                data: service, 
            });
            } catch (error) {
              res.send({
                success: false,
                error: error.message
            })
            }
        });

        app.get('/services', async(req, res) =>{
            try {
              const cursor = serviceCollection.find({});
              const service = await cursor.toArray();
              res.send({
                success: true,
                message : `Successfully got the service`,
                data: service, 
            });
            } catch (error) {
              res.send({
                success: false,
                error: error.message
            })
            }
        });

        app.get('/service/:id', async(req, res)=>{
          try {
            const id = req.params.id;
            const service = await serviceCollection.findOne({_id: ObjectId(id)});
          
             res.send({
                success: true,
                message : `Successfully got the service`,
                data: service, 
            });
          } catch (error) {
             res.send({
                success: false,
                error: error.message
            })
          }
        });


        app.post('/review', async(req, res) =>{
          try {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);

            res.send({
                success: true,
                message : `Thanks for your review, Good wish for you`
            });

          } catch (error) {
             res.send({
                success: false,
                error: error.message
            })
          }
        })








app.listen(port, () => console.log('node server is running'))