const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
// const corsConfig = {
//   origin: "",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
// };

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
// app.use(cors(corsConfig));
// app.options("", cors(corsConfig));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v7xfdwv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const toyCollection = client.db("AllToys").collection("Toys");
    const ChildData = client.db("ChildData").collection("Data");

    // Get all Toys
    app.get("/toys", async (req, res) => {
      try {
        const result = await toyCollection.find({}).toArray();
        res.send(result);
      } catch (error) {
        res.send({ error: error?.message });
      }
    });

    // Get a toy details.
    app.get("/toys/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await toyCollection.findOne(filter);
        res.send(result);
      } catch (error) {
        res.send({ error: error?.message });
      }
    });

    // Get all child Data
    app.get("/childData", async (req, res) => {
      try {
        const result = await ChildData.find({}).toArray();
        res.send(result);
      } catch (error) {
        res.send({ error: error?.message });
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log("Toy server is running on port 5000");
});
