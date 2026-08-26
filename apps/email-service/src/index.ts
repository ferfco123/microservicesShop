import { consumer } from "./utils/kafka";
import { runKafkaSubscriptions } from "./utils/subscirptions";

const start = async () => {
  try {
    await consumer.connect();

    await runKafkaSubscriptions();

    await consumer.run();

    console.log("Email service running ");
  } catch (error) {
    console.error("Error starting service:", error);
  }
};

start();
