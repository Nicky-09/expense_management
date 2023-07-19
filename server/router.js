const Router = require("express").Router();
const bcrypt = require("bcrypt");
const { Users, Transactions, Comments } = require("./schema");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

Router.get("/healthhCheck", (req, res) => {
  res.send("Server is up and running");
});

// Middleware function for API authorization
const authorize = (req, res, next) => {
  // Get the JWT token from the request headers or query parameters
  const token = req.headers.authorization || req.query.token;
  if (!token) {
    // Token not provided
    return res.status(401).json({ message: "Authorization token not found" });
  }

  try {
    // Verify and decode the JWT token
    const decoded = jwt.verify(token, "secret-key");
    // Attach the decoded payload to the request object for further use
    req.user = decoded;
    // Move to the next middleware or route handler
    console.log("authorization success");
    next();
  } catch (error) {
    console.log("authorization error:", error);
    // Token verification failed
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Signup route implementation
// Creates a new user account with provided username, email, and password
Router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Users({ username, email, password: hashedPassword });
    await user.save();

    console.log("/signup - User created successfully");
    res
      .status(201)
      .json({ message: "User created successfully", success: true });
  } catch (error) {
    console.log("/signup - error", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

// Login route implementation
// Authenticates user credentials (email and password) and generates a JWT token
Router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      "secret-key",
      {
        expiresIn: "24h",
      }
    );

    console.log("/login - user logged in successfully");

    res.status(200).json({ token, success: true, email });
  } catch (error) {
    console.log("/login -error ", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

// Add a new transaction
Router.post("/transactions", authorize, async (req, res) => {
  const { userId } = req.user;
  console.log({ userId });
  try {
    console.log("first");
    const { category, amount, description, date } = req.body;
    const newTransaction = new Transactions({
      user: userId,
      category,
      amount,
      description,
      date,
    });
    console.log({ newTransaction });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all transactions for a user
Router.get("/transactions", authorize, async (req, res) => {
  const { userId } = req.user;
  try {
    const transactions = await Transactions.find({ user: userId });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete a transaction
Router.delete("/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transactions.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    await transaction.remove();
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = Router;
