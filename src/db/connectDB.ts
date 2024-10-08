import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const dbURI =
  process.env.MONGO_DB_URI ||
  "mongodb+srv://shashwat:shashwat@cluster0.4q1atv1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connetDB = async () => {
  try {
    const DB_OPTIONS = {
      dbName: DB_NAME,
    };
    const connectionInstance = await mongoose.connect(dbURI);
    console.log(
      `\n MongoDb connected!! DB:Host${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB error :", error);
    process.exit(1);
  }
};

export default connetDB;
