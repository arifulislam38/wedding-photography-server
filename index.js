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

// middleware added for jwt token

function verifyJWT(req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send({message: 'unauthorized access'});
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_secret, function(err, decoded){
        if(err){
            return res.status(403).send({message: 'Forbidden access'});
        }
        req.decoded = decoded;
        next();
    })
}

// middleware end

// run function for db connected

async function run() {
  try {
    await client.connect();

  } catch(error) {
    console.log(error.name, error.message)
  }
}
run();

// run function ended
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
        });


        app.get('/review', async(req, res) =>{
          try {
            const name = req.query.name;
            const cursor = await reviewCollection.find({name}).sort({time : -1});
            const result = await cursor.toArray();
            res.send({
                success: true,
                message : `all products finded`,
                data: result

            });

          } catch (error) {
             res.send({
                success: false,
                error: error.message
            })
          }
        });

        // verify jwt token for reviews given

        app.get('/reviews',verifyJWT, async(req, res) =>{
          try {
            const decoded = req.decoded;
            if(decoded.email !== req.query.email){
                return res.status(403).send({message: 'unauthorized access'})
            }

            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            
            const cursor = reviewCollection.find(query).sort({time : -1});
            const result = await cursor.toArray();
            
            res.send({
                success: true,
                message : `all reviews found`,
                data: result
                

            });

          } catch (error) {
             res.send({
                success: false,
                error: error.message
            })
          }
        });


        app.delete('/reviews/:id', async (req, res) => {
            try {
              const id = req.params.id;
              const query = { _id: ObjectId(id) };
              const result = await reviewCollection.deleteOne(query);
              res.send({
                success: true,
                message : 'successfully deleted',
                data: result
            });
            } catch (error) {
              res.send({
                success: false,
                error: error.message
            })
            }
        });


        app.get('/update/:id', async(req, res) =>{
          try {
            const id = req.params.id;
            const cursor = await reviewCollection.findOne({_id: ObjectId(id)});
            res.send({
                success: true,
                message : `all products finded`,
                data: cursor

            });

          } catch (error) {
             res.send({
                success: false,
                error: error.message
            })
          }
        });
        

        app.patch('/updates/:id', async(req, res) =>{
          try {
            const id = req.params.id;
            const text = req.body.details;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.updateOne(query, {$set: {details: text}}, { upsert: true });
            console.log(text)

            res.send({
                success: true,
                message : `updated`,
                data: result

            });

          } catch (error) {
             res.send({
                success: false,
                error: error.message
            })
          }
        });

        app.post('/addservice', async(req, res) =>{
          try {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);

            res.send({
                success: true,
                message : `Thanks for your review, Good wish for you`,
                data: result
            });

          } catch (error) {
             res.send({
                success: false,
                error: error.message
            })
          }
        });







app.listen(port, () => console.log('node server is running'))