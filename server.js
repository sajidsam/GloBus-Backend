require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { signupUser, signinUser } = require("./Controllers/userController");
const { browseProduct } = require("./Controllers/productController");


const app = express();
app.use(cors());
app.use(express.json());


const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

app.locals.mongoClient = client;

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    // Routes
    app.get('/',(req,res)=>{
      res.send('working')
    })
    app.post("/signup", signupUser);
    app.post("/signin", signinUser);
    app.get("/browseProduct",browseProduct);

    
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
  }
}

run().catch(console.dir);
