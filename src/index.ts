import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./db/connectDB";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 3000;
//middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());

//routes
import router from "./routes/user.route";

app.use("/api/user", router);
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
