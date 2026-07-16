require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const WebSocket = require("ws");

const app = express();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    realtime: {
      transport: WebSocket
    }
  }
);
const TABLE = "users"; // Change this if your table has a different name

// Home
app.get("/", (req, res) => {
  res.send("Supabase CRUD API Running...");
});


// =====================
// GET ALL USERS
// =====================
app.get("/users", async (req, res) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*");

  if (error)
    return res.status(500).json(error);

  res.json(data);
});


// =====================
// GET USER BY ID
// =====================
app.get("/users/:id", async (req, res) => {

  const { id } = req.params;

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error)
    return res.status(404).json(error);

  res.json(data);
});


// =====================
// CREATE USER
// =====================
app.post("/users", async (req, res) => {

  const { name, email } = req.body;

  const { data, error } = await supabase
    .from(TABLE)
    .insert([
      {
        name,
        email,
      },
    ])
    .select();

  if (error)
    return res.status(500).json(error);

  res.status(201).json(data);
});


// =====================
// UPDATE USER
// =====================
app.put("/users/:id", async (req, res) => {

  const { id } = req.params;
  const { name, email } = req.body;

  const { data, error } = await supabase
    .from(TABLE)
    .update({
      name,
      email,
    })
    .eq("id", id)
    .select();

  if (error)
    return res.status(500).json(error);

  res.json(data);
});


// =====================
// DELETE USER
// =====================
app.delete("/users/:id", async (req, res) => {

  const { id } = req.params;

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error)
    return res.status(500).json(error);

  res.json({
    message: "User deleted successfully"
  });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});