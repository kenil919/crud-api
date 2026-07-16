Supabase does not host a traditional Node.js backend server (Express/Fastify). It provides:

PostgreSQL database
Authentication
Storage
Edge Functions (Deno)
Realtime features

If your project is an Express.js application, you should:

Host your Node.js backend on a platform like Render, Railway, Fly.io, or a VPS.
Use Supabase as your database.
Architecture
Frontend
    │
    ▼
Node.js + Express API (Render/Railway)
    │
    ▼
Supabase PostgreSQL Database
Step 1: Create Supabase Project
Go to the Supabase website.
Sign in with GitHub or Google.
Click New Project.
Enter:
Organization
Project Name
Database Password
Region
Wait for the project to be created.
Step 2: Create Database Table

Open

SQL Editor

Create a table.

Example:

create table users (
    id bigint generated always as identity primary key,
    name text not null,
    email text unique not null,
    age integer,
    created_at timestamp default now()
);

Click Run.

Your table is now ready.

Step 3: Get Database Connection String

Go to

Settings
→ Database

Copy the PostgreSQL connection string.

Example:

postgresql://postgres:password@db.xxxxxxxxx.supabase.co:5432/postgres
Step 4: Create Node.js Project
mkdir crud-api

cd crud-api

npm init -y

Install packages

npm install express pg dotenv cors
Step 5: Folder Structure
crud-api

│
├── server.js
├── .env
├── package.json
├── routes
│      users.js
│
└── db.js
Step 6: Create .env
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
PORT=3000
Step 7: Database Connection

db.js

const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

## https://esqjjrbofvqtlhkkrrfk.supabase.co/rest/v1/users

# postgresql://postgres:[YOUR-PASSWORD]@db.esqjjrbofvqtlhkkrrfk.supabase.co:5432/postgres

module.exports = pool;
Step 8: Create Express Server

server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/users");

app.use("/users", userRoutes);

app.listen(process.env.PORT, () => {
    console.log("Server Running");
});
Step 9: CRUD Routes

routes/users.js

const express = require("express");
const router = express.Router();
const db = require("../db");

// Create
router.post("/", async (req, res) => {
    const { name, email, age } = req.body;

    const result = await db.query(
        "INSERT INTO users(name,email,age) VALUES($1,$2,$3) RETURNING *",
        [name, email, age]
    );

    res.json(result.rows[0]);
});

// Read
router.get("/", async (req, res) => {
    const result = await db.query("SELECT * FROM users");
    res.json(result.rows);
});

// Read by ID
router.get("/:id", async (req, res) => {
    const result = await db.query(
        "SELECT * FROM users WHERE id=$1",
        [req.params.id]
    );

    res.json(result.rows[0]);
});

// Update
router.put("/:id", async (req, res) => {
    const { name, email, age } = req.body;

    const result = await db.query(
        `UPDATE users
         SET name=$1,email=$2,age=$3
         WHERE id=$4
         RETURNING *`,
        [name, email, age, req.params.id]
    );

    res.json(result.rows[0]);
});

// Delete
router.delete("/:id", async (req, res) => {
    await db.query(
        "DELETE FROM users WHERE id=$1",
        [req.params.id]
    );

    res.json({
        message: "Deleted Successfully"
    });
});

module.exports = router;
Step 10: Test API

Run

node server.js

Test with Postman:

Create
POST /users
{
    "name":"Kenil",
    "email":"kenil@gmail.com",
    "age":22
}
Get All
GET /users
Get One
GET /users/1
Update
PUT /users/1
{
    "name":"Kenil Patel",
    "email":"kenil@gmail.com",
    "age":23
}
Delete
DELETE /users/1
Step 11: Push to GitHub
git init

git add .

git commit -m "CRUD API"

git branch -M main

git remote add origin YOUR_GITHUB_URL

git push -u origin main
Step 12: Deploy Backend

A simple option is Render:

Sign in to Render.
Click New → Web Service.
Connect your GitHub repository.
Configure:
Environment: Node
Build Command: npm install
Start Command: node server.js
Add environment variables:
DATABASE_URL
PORT (optional; Render sets this automatically)
Click Deploy.

After deployment, you'll get a URL such as:

https://your-api.onrender.com

Your API endpoints will be:

GET    /users
POST   /users
PUT    /users/:id
DELETE /users/:id
If you want to use the Supabase JavaScript API instead of connecting directly with PostgreSQL

Install:

npm install @supabase/supabase-js

Then create a client:

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

You can then perform CRUD operations like:

const { data, error } = await supabase
  .from("users")
  .select("*");

This approach uses the Supabase API rather than a direct PostgreSQL connection.

If you're new to Node.js and Express, I can also provide a complete CRUD project with:

Express.js
MVC folder structure
Supabase PostgreSQL
JWT authentication
Validation
Error handling
Ready-to-deploy configuration for Render or Railway.