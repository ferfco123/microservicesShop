import { Kafka } from "kafkajs";

export const createKafkaClient = (service: string, brokers: string[]) => {
  const kafka = new Kafka({
    clientId: service,
    brokers,
  });
  return kafka;
};
