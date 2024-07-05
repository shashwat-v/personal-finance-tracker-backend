import express from "express";
import bodyParser from "body-parser";
import connectDB from "./db/connectDB";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// database
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      //process.env.PORT ||
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
