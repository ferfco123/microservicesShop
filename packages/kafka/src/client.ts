// import { Kafka } from "kafkajs";

// export const createKafkaClient = (service: string, brokers: string[]) => {
//   const kafka = new Kafka({
//     clientId: service,
//     brokers,
//   });
//   return kafka;
// };

import { Kafka, SASLOptions } from "kafkajs";

export const createKafkaClient = (service: string, brokers: string[]) => {
  const username = process.env.KAFKA_USERNAME;
  const password = process.env.KAFKA_PASSWORD;
  const mechanism = (process.env.KAFKA_SASL_MECHANISM || "scram-sha-256") as
    | "scram-sha-256"
    | "plain"
    | "scram-sha-512";

  const sasl: SASLOptions | undefined =
    username && password ? { mechanism, username, password } : undefined;

  return new Kafka({
    clientId: service,
    brokers,

    ssl: !!username,
    sasl,
  });
};
