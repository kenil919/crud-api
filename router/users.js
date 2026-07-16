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