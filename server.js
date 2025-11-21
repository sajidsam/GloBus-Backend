require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { signupUser, signinUser } = require("./Controllers/userController");
const {
  createAdmin,
  getRole,
  showUsers,
  deleteUser,
  toggleUserStatus
} = require("./Controllers/AdminController");
const {
  browseProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require("./Controllers/productController");
const {  getProductById } = require("./Controllers/searchController");
const {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
} = require("./Controllers/cartController");

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

app.locals.mongoClient = client;

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    // Create admin
    await createAdmin(client.db("globusDB"));

    // Auth Route
    app.post("/signup", signupUser);
    app.post("/signin", signinUser);

    // Role Route
    app.get("/getRole", getRole);

    // Admin User Management Route
    app.get("/admin/users", showUsers);
    app.delete("/admin/user/:id", deleteUser);
    app.patch("/admin/user/:id/status", toggleUserStatus);

    // Admin Products Route
    app.post("/addProducts", createProduct);
    app.put("/products/:id", updateProduct);
    app.delete("/products/:id", deleteProduct);

    // General Products Route
    app.get("/browseProduct", browseProduct);
    app.get("/productDetail/:id", getProductById);

    // Cart Route
    app.post("/cart/add", addToCart);
    app.get("/cart/:userId", getCart);
    app.put("/cart/update/:cartItemId", updateCartQuantity);
    app.delete("/cart/remove/:cartItemId", removeFromCart);
    app.delete("/cart/clear/:userId", clearCart);

    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
  }
}

run().catch(console.dir);