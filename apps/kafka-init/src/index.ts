import dotenv from "dotenv";
dotenv.config();

import { createKafkaClient } from "@repo/kafka";

const kafka = createKafkaClient(
  "kafka-init",
  process.env.KAFKA_BROKERS!.split(","),
);

const run = async () => {
  const admin = kafka.admin();

  await admin.connect();

  console.log("Creating topics...");

  await admin.createTopics({
    topics: [
      {
        topic: "product.created",
        numPartitions: 1,
        replicationFactor: 1,
      },
      {
        topic: "product.deleted",
        numPartitions: 1,
        replicationFactor: 1,
      },
      {
        topic: "payment.successful",
        numPartitions: 1,
        replicationFactor: 1,
      },
      {
        topic: "order.created",
        numPartitions: 1,
        replicationFactor: 1,
      },
      {
        topic: "user.created",
        numPartitions: 1,
        replicationFactor: 1,
      },
    ],
  });

  console.log("Topics created successfully");

  await admin.disconnect();
};

run().catch((err) => {
  console.error("Kafka init failed", err);
  process.exit(1);
});
