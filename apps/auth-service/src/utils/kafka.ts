import { createKafkaClient, createProducer } from "@repo/kafka";

const kafkaClient = createKafkaClient(
  "auth-service",
  process.env.KAFKA_BROKERS!.split(","),
);
export const producer = createProducer(kafkaClient);
