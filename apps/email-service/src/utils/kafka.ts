import dotenv from "dotenv";
dotenv.config();

import { createConsumer, createKafkaClient, createProducer } from "@repo/kafka";

const kafkaClient = createKafkaClient(
  "email-service",
  process.env.KAFKA_BROKERS!.split(","),
);

export const consumer = createConsumer(kafkaClient, "email-service");
