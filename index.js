

require("dotenv").config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
}));
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@libas.ytrfpwj.mongodb.net/?retryWrites=true&w=majority&appName=Libas`;

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
        const db = client.db('libasbd2')

        const usersCollection = db.collection('users');
        const productsCollection = db.collection('products');

        // users related apis
        // add a user 
        app.post('/users/:email', async (req, res) => {
            const email = req.params.email
            const filter = { email }
            const isExist = await usersCollection.findOne(filter)
            if (isExist) return res.send({ message: 'User already exist' })

            const user = req.body
            user.role = 'customer';
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })


        // Product related apis --------------------------------

        // add a product 
        app.post('/products', async (req, res) => {
            const product = req.body
            const result = await productsCollection.insertOne(product)
            res.send(result)
        })

        // get new arrivals 
        app.get('/new-arrivals', async (req, res) => {
            const filter = { showcase: 'new-arrivals' }
            const result = await productsCollection.find(filter).toArray()
            res.send(result)
        })








        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('LIBAS Is Running!')
})

app.listen(port, () => {
    console.log(`Camp is running on port: ${port}`)
})