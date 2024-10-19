const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kqp32.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database and collection reference
let coffeeCollection;

// Connect to MongoDB
async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Successfully connected to MongoDB!");

    // Initialize the coffee collection
    coffeeCollection = client.db('coffeeDB').collection('coffee');

//getitem from database :

app.get('/coffee',async(req,res)=>{
  const cursor = coffeeCollection.find()
  const result = await  cursor.toArray()
res.send(result)
})

//
app.get('/coffee/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id) };//work as a filter
  const result = await coffeeCollection.findOne(query);
res.send(result)
}
)

    // API endpoint to add new coffee
app.post('/coffee', async (req, res) => {
  const newCoffee = req.body;
  console.log(newCoffee);
  const result = await coffeeCollection.insertOne(newCoffee);
  res.send(result);
});

//update coffee
app.put('/coffee/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };//work as a filter

  const updatedCoffee = req.body;

  const coffee = {
    $set: {
      name: updatedCoffee.name,
      quantity: updatedCoffee.quantity,
      supplier: updatedCoffee.supplier,
      teast: updatedCoffee.teast,
      details:updatedCoffee.details,
      price :updatedCoffee.price,
      category: updatedCoffee.category,
      photo:  updatedCoffee.photo,

    }
  }
  const result = await coffeeCollection.updateOne(query,coffee)
res.send(result);
})


  //delete specific  item from database
app.delete('/coffee/:id',async(req,res)=>{
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await coffeeCollection.deleteOne(query);
  res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }

  catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit if there's a connection error
  }
}

// Start the MongoDB connection
run().catch(console.dir);



// Root endpoint
app.get('/', (req, res) => {
  res.send('Coffee making server is running');
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
