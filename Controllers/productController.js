const browseProduct = async (req, res) => {
  try {
    const client = req.app.locals.mongoClient;
    const database = client.db("globusDB");
    const productsCollection = database.collection("products");

    
    const products = await productsCollection.find({}).toArray();

    
    res.status(200).json(products);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { browseProduct };