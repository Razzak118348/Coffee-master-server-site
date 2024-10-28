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

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database and collection reference
let coffeeCollection;
let userCollection;

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Successfully connected to MongoDB!");

    // Initialize the coffee and user collections
    coffeeCollection = client.db('coffeeDB').collection('coffee');
    userCollection = client.db('coffeeDB').collection('user');

    // Coffee endpoints
    app.get('/coffee', async (req, res) => {
      try {
        const cursor = coffeeCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error retrieving coffee data", error });
      }
    });

    app.get('/coffee/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await coffeeCollection.findOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error retrieving coffee by ID", error });
      }
    });

    app.post('/coffee', async (req, res) => {
      try {
        const newCoffee = req.body;
        const result = await coffeeCollection.insertOne(newCoffee);
        res.status(201).send(result);
      } catch (error) {
        res.status(500).send({ message: "Error adding new coffee", error });
      }
    });

    app.put('/coffee/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const updatedCoffee = req.body;
        const updateDoc = {
          $set: {
            name: updatedCoffee.name,
            quantity: updatedCoffee.quantity,
            supplier: updatedCoffee.supplier,
            teast: updatedCoffee.teast,
            details: updatedCoffee.details,
            price: updatedCoffee.price,
            category: updatedCoffee.category,
            photo: updatedCoffee.photo,
          }
        };
        const result = await coffeeCollection.updateOne(query, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error updating coffee", error });
      }
    });

    app.delete('/coffee/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await coffeeCollection.deleteOne(query);
        res.status(204).send(result);
      } catch (error) {
        res.status(500).send({ message: "Error deleting coffee", error });
      }
    });

    // User endpoints
    app.get('/user', async (req, res) => {
      try {
        const cursor = userCollection.find();
        const users = await cursor.toArray();
        res.send(users);
      } catch (error) {
        res.status(500).send({ message: "Error retrieving users", error });
      }
    });

    app.post('/user', async (req, res) => {
      try {
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.status(201).send(result);
      } catch (error) {
        res.status(500).send({ message: "Error adding user", error });
      }
    });

    app.delete('/user/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await userCollection.deleteOne(query);
        res.status(204).send(result);
      } catch (error) {
        res.status(500).send({ message: "Error deleting user", error });
      }
    });

    // Ping the database to confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

// Start the MongoDB connection
run().catch(console.dir);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Coffee making server is running');
});



module.exports = app;