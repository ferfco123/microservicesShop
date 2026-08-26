import dootenv from "dotenv";
dootenv.config();

import { createConsumer, createKafkaClient, createProducer } from "@repo/kafka";

const kafkaClient = createKafkaClient(
  "order-service",
  process.env.KAFKA_BROKERS!.split(","),
);

export const producer = createProducer(kafkaClient);
export const consumer = createConsumer(kafkaClient, "order-service-group");
