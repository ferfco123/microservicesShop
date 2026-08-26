import mongoose from "mongoose";
import "dotenv/config";

let isConnected = false;
export const connectDb = async () => {
  if (isConnected) return;
  try {
    if (!process.env.MONGO) {
      throw new Error("Mongo is not defined");
    }

    mongoose.connect(process.env.MONGO);
    console.log("MongoDb connected");
    isConnected = true;
  } catch (error) {
    console.log(error);
  }
};
