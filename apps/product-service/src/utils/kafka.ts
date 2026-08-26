import dotenv from "dotenv";
dotenv.config();
import { createConsumer, createKafkaClient, createProducer } from "@repo/kafka";

const kafkaClient = createKafkaClient(
  "product-service",
  process.env.KAFKA_BROKERS!.split(","),
);
export const producer = createProducer(kafkaClient);
export const consumer = createConsumer(kafkaClient, "product-group");
