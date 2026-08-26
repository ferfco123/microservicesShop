import { resolve } from "path";
import app from "src/index.js";
import { producer } from "src/utils/kafka.js";

const start = async () => {
  try {
    await producer.connect();
    app.listen(8830, () => {
      console.log("auth-server is running");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
