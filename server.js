const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Home route
app.get("/", (req, res) => {
  res.send("Node.js + Supabase API is running");
});

// Get all users
app.get("/users", async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("*");

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

// Create user
app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  const { data, error } = await supabase
    .from("users")
    .insert([{ name, email }])
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  res.status(201).json(data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});