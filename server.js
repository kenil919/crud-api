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