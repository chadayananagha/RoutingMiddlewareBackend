const express = require("express");
const app = express();
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

const pool = new Pool();

app.get("/", (req, res) => {
  res.json("Welcome to my API");
});

app.get("/users", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM users;");
    res.send(data.rows);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

// Route to create a user
app.post("/users", async (req, res) => {
  try {
    const { username, email, token_id } = req.body;
    const query =
      "INSERT INTO users (username, email, token_id) VALUES ($1, $2, $3) RETURNING *";
    const values = [username, email, token_id];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/token", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM token;");
    res.send(data.rows);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

// Route to create a token for a specific user
app.post("/token/:user_id", async (req, res) => {
  try {
    const { value } = req.body;
    const user_id = req.params.user_id;
    const query = "INSERT INTO token (value) VALUES ($1) RETURNING id";
    const values = [value];
    const result = await pool.query(query, values);

    const token_id = result.rows[0].id;
    const updateUserQuery =
      "UPDATE users SET token_id = $1 WHERE id = $2 RETURNING *";
    const updateUserValues = [token_id, user_id];
    await pool.query(updateUserQuery, updateUserValues);

    res.json({ message: "Token created and linked to user", token_id });
  } catch (error) {
    console.error("Error creating token:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to verify a token
app.get("/api/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const query =
      "SELECT * FROM users WHERE token_id = (SELECT id FROM token WHERE value = $1)";
    const result = await pool.query(query, [token]);

    if (result.rows.length > 0) {
      res.send("Token valid");
    } else {
      res.status(401).send("Invalid token");
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Middleware to inspect if there is a parameter named 'token'
// and if it has a value longer than 3 characters.
// Responds with 403 if no token or token is shorter than 4 characters.
function secure(req, res, next) {
  const token = req.params.token;
  if (token && token.length > 3) {
    console.log("Token found:", token);
    next(); // Continue to the next middleware
  } else {
    res.status(403).send("Access Forbidden: Token missing or too short");
  }
}

// // Apply the secure middleware to the GET route '/verify/:token'
app.get("/verify/:token", secure, (req, res) => {
  res.send("Hello World!");
});

// // // Route to handle the case when the token doesn't exist
app.get("/verify/", (req, res) => {
  res.status(403).send("Token missing or too short");
});

// // Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
