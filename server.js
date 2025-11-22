require("dotenv").config();
const express = require("express");
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

const { getProductById } = require("./Controllers/searchController");

const {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
} = require("./Controllers/cartController");


const { initSSLCommerz,
  handleIPN,
  paymentSuccess,
  paymentFailed,
  paymentCancel,
  getUserOrders
} = require("./Controllers/PaymentController");

const app = express();
const cors = require("cors");
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
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

    // Role Route
    app.get("/getRole", getRole);

    // Auth Route
    app.post("/signup", signupUser);
    app.post("/signin", signinUser);

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

    //Order & Payment History Routes
    app.get("/api/orders", getUserOrders);

    // Cart Route
    app.post("/cart/add", addToCart);
    app.get("/cart/:userId", getCart);
    app.put("/cart/update/:cartItemId", updateCartQuantity);
    app.delete("/cart/remove/:cartItemId", removeFromCart);
    app.delete("/cart/clear/:userId", clearCart);

    // SSL Commerz Payment Routes
    app.post("/api/sslcommerz/init", initSSLCommerz);
    app.post("/api/sslcommerz/ipn", handleIPN);
    app.post("/api/sslcommerz/success/:tran_id", paymentSuccess);
    app.post("/api/sslcommerz/fail/:tran_id", paymentFailed);
    app.post("/api/sslcommerz/cancel/:tran_id", paymentCancel);
    app.get("/api/orders", getUserOrders);

    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
  }
}

run().catch(console.dir);