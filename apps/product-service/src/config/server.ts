import { consumer, producer } from "../utils/kafka.js";
import app from "../index.js";
import dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), "../../.env") });

const start = async () => {
  try {
    await Promise.all([producer.connect(), consumer.connect()]);
    app.listen(8800, () => {
      console.log("product-server is running");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
