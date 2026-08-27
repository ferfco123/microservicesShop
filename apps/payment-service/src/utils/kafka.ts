import dotenv from "dotenv";
dotenv.config();
import { createConsumer, createKafkaClient, createProducer } from "@repo/kafka";
const brokersEnv =
  process.env.KAFKA_BROKERS || process.env.KAFKA_BROKER || "localhost:9092";
const kafkaClient = createKafkaClient("payment-service", brokersEnv.split(","));
export const producer = createProducer(kafkaClient);
export const consumer = createConsumer(kafkaClient, "payment-service-group");
