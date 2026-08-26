import { connectDb } from "@repo/orderdb";
import { consumer, producer } from "../utils/kafka.js";
import { runKafkaSubscriptions } from "../utils/subscriptions.js";
import appFastify from "../index.js";
import { initOrderCron } from "../SeedData/orderCron.js";

const start = async () => {
  try {
    await connectDb();

    await Promise.all([producer.connect(), consumer.connect()]);

    await runKafkaSubscriptions();
    initOrderCron();
    await appFastify.listen({ port: 8810, host: "0.0.0.0" });
    console.log("🚀 order-service está ejecutándose en el puerto 8810");
  } catch (err) {
    console.error("❌ Error al iniciar order-service:", err);
    process.exit(1);
  }
};

start();
