const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 9988

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://default_ashaansojib:9080Sojib@cluster0.ugrpd0k.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const fileBD = client.db('o-gsm-service').collection('all-files');
        const serviceBD = client.db('o-gsm-service').collection('online-service');
        const pages = client.db('o-gsm-service').collection('pages')
        // all file section and queries
        app.get('/all-files', async (req, res) => {
            const files = await fileBD.find().toArray();
            res.send(files)
        });
        app.post('/add-file', async (req, res) => {
            const data = req.body;
            const post = await fileBD.insertOne(data);
            res.send(post);
        });
        app.get('/file-brand/:brand', async (req, res) => {
            const query = req.params.brand;
            const filter = { brand: query }
            const files = await fileBD.find(filter).toArray();
            res.send(files);
        });
        app.delete('remove-post/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const remove = await fileBD.deleteOne(filter);
            res.send(remove);
        });
        // all tools get in there
        app.get('/all-tools', async (req, res) => {
            const result = await fileBD.find({ category: 'driver' }).toArray();
            res.send(result);
        });
        // services add area
        app.get('/o-services', async (req, res) => {
            const allPost = await serviceBD.find().toArray();
            res.send(allPost);
        });
        app.get('/service-category/:category', async (req, res) => {
            const name = req.params.category;
            const filter = { category: name }
            const result = await serviceBD.find(filter).toArray();
            res.send(result)
        })
        app.post('/add-service', async (req, res) => {
            const data = req.body;
            const posted = await serviceBD.insertOne(data);
            res.send(posted);
        });
        app.delete('/remove-service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const removed = await serviceBD.deleteOne(query);
            res.send(removed);
        });
        app.get('/pages', async (req, res) => {
            const data = req.body;
            const page = await pages.insertOne(data);
            res.send(page);
        });
        app.delete('/remove-page/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const removed = await pages.deleteOne(query);
            res.send(removed);
        });
        
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
    res.send('the ogsmserver is running')
});
app.listen(port, async (req, res) => {
    console.log('the server is running on 9988 port')
});