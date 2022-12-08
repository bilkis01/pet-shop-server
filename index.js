const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//  middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Running pet shop server')
});



// connect database



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.waylnfs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const productCollection = client.db('petshop').collection('product');


        // load data
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

        //  find one id

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })

    }
    finally {

    }

}
run().catch(console.dir)

app.listen(port, () => {
    console.log("Listening the port", port);
})
