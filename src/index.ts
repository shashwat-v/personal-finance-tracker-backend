import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;

app.use(bodyParser.json());

// Mongoose Declaration
const dbURI = `mongodb+srv://${USER}:${PASSWORD}@cluster0.4q1atv1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch((err) => {
    console.error(err);
  });

// Express root code
app.get("/", (req, res) => {
  res.send("Hello Finance Tracker");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
