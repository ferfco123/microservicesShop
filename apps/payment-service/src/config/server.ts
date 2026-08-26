import { serve } from "@hono/node-server";
import { fileURLToPath } from "url";
import app from "../index.js";
import { consumer, producer } from "../utils/kafka.js";
import { runKafkaSubscriptions } from "../utils/subscriptions.js";

const start = async () => {
  try {
    await producer.connect();
    await consumer.connect();

    await runKafkaSubscriptions();
    await consumer.run();
    serve(
      {
        fetch: app.fetch,
        port: 8820,
      },
      () => console.log("payment-service running"),
    );
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

start();
