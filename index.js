const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 9988;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://default_ashaansojib:9080Sojib@cluster0.ugrpd0k.mongodb.net/?retryWrites=true&w=majority";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const toolAndDriver = client.db("o-gsm-service").collection("tool-driver");
    const blogPosts = client.db("o-gsm-service").collection("blogs");
    const fileBD = client.db("o-gsm-service").collection("all-files");
    const serviceBD = client.db("o-gsm-service").collection("online-service");
    const pages = client.db("o-gsm-service").collection("pages");
    const agents = client.db("o-gsm-service").collection("agents");

    // all blogs posts api here--------------------------------->
    app.get("/blogs", async (req, res) => {
      const blogs = await blogPosts.find().toArray();
      res.send(blogs);
    });
    app.post("/add-blog", async (req, res) => {
      const blogs = req.body;
      const posts = await blogPosts.insertOne(blogs);
      res.send(posts);
    });



    // ---------------------all file section and queries--------------------------
    app.get("/all-files", async (req, res) => {
      const files = await fileBD.find().toArray();
      res.send(files);
    });
    app.post("/add-file", async (req, res) => {
      const data = req.body;
      const post = await fileBD.insertOne(data);
      res.send(post);
    });
    app.get("/file-brand/:brand", async (req, res) => {
      const query = req.params.brand;
      const filter = { brand: { $regex: query, $options: 'i' } };
      const files = await fileBD.find(filter).toArray();
      res.send(files);
    });
    app.delete("/remove-post/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const remove = await fileBD.deleteOne(filter);
      res.send(remove);
    });
    app.get("/single-file/:id", async (req, res) => {
      const id = req.params.id;
      const data = { _id: new ObjectId(id) };
      const filter = await fileBD.findOne(data);
      res.send(filter);
    });
    app.get("/unique-posts", async (req, res) => {
      try {
        const uniqueBrands = await fileBD
          .aggregate([
            {
              $group: {
                _id: "$brand",
                documentId: { $first: "$_id" },
              },
            },
            {
              $project: {
                _id: "$documentId",
                brand: "$_id",
              },
            },
          ])
          .toArray();

        res.send(uniqueBrands);
      } catch (error) {
        console.error("Error fetching unique brands:", error);
        res.status(500).send("Internal Server Error");
      }
    });


    // -------------------all tools get in there--------------------
    app.get("/all-tools", async (req, res) => {
      const filter = await toolAndDriver.find().toArray();
      res.send(filter);
    });
    app.get("/single-tool/:id", async (req, res) => {
      const id = req.params.id;
      const data = { _id: new ObjectId(id) };
      const filter = await toolAndDriver.findOne(data);
      res.send(filter);
    });
    app.delete("/remove-tool/:id", async (req, res) => {
      const id = req.params.id;
      const data = { _id: new ObjectId(id) };
      const filter = await toolAndDriver.deleteOne(data);
      res.send(filter);
    });
    app.post("/add-tool", async (req, res) => {
      const data = req.body;
      const result = await toolAndDriver.insertOne(data);
      res.send(result);
    });
    // todo load all data, need to get specific data
    app.get("/tool-category/:brand", async (req, res) => {
      const brand = req.params.brand;
      const allBrand = { brand: { $regex: brand, $options: "i" } };
      const result = await toolAndDriver.find(allBrand).toArray();
      res.send(result);
    });
    app.get("/unique-brands", async (req, res) => {
      try {
        const uniqueBrands = await toolAndDriver
          .aggregate([
            {
              $group: {
                _id: "$brand",
                documentId: { $first: "$_id" },
              },
            },
            {
              $project: {
                _id: "$documentId",
                brand: "$_id",
              },
            },
          ])
          .toArray();

        res.send(uniqueBrands);
      } catch (error) {
        console.error("Error fetching unique brands:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // ------------------services add area----------------------------
    app.get("/o-services", async (req, res) => {
      const allPost = await serviceBD.find().toArray();
      res.send(allPost);
    });
    app.get("/service-category/:category", async (req, res) => {
      const name = req.params.category;
      const filter = { category: name };
      const result = await serviceBD.find(filter).toArray();
      res.send(result);
    });
    app.post("/add-service", async (req, res) => {
      const data = req.body;
      const posted = await serviceBD.insertOne(data);
      res.send(posted);
    });
    app.delete("/remove-service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const removed = await serviceBD.deleteOne(query);
      res.send(removed);
    });

    // pages area-----------------------------
    app.get("/pages", async (req, res) => {
      const data = req.body;
      const page = await pages.insertOne(data);
      res.send(page);
    });
    app.delete("/remove-page/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const removed = await pages.deleteOne(query);
      res.send(removed);
    });


    // ------------------------agents area apis------------------------
    app.get("/agents", async (req, res) => {
      const agent = await agents.find().toArray();
      res.send(agent);
    });
    app.post("/add-agent", async (req, res) => {
      const data = req.body;
      const agent = await agents.insertOne(data);
      res.send(agent);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("the ogsmserver is running");
});
app.listen(port, async (req, res) => {
  console.log("the server is running on 9988 port");
});
