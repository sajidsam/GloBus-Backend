const signupUser = async (req, res) => {
  try {
    const client = req.app.locals.mongoClient;
    const database = client.db("globusDB");
    const usersCollection = database.collection("users");

    const { name, email, phone, password } = req.body;

    
    const exists = await usersCollection.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists!" });

    const result = await usersCollection.insertOne({ name, email, phone, password });

    res.json({
      _id: result.insertedId,
      name,
      email,
      phone
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const signinUser = async (req, res) => {
  try {
    const client = req.app.locals.mongoClient;
    const usersCollection = client.db("globusDB").collection("users");

    const { email, password } = req.body;

    
    const user = await usersCollection.findOne({ email, password });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    
    const { password: pwd, ...userData } = user;
    res.json({ user: userData });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { signupUser, signinUser };
