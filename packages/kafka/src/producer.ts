import { type Kafka, type Producer } from "kafkajs";

export const createProducer = (kafka: Kafka) => {
  const producer: Producer = kafka.producer({
    allowAutoTopicCreation: false,
    idempotent: true,
    maxInFlightRequests: 5,
  });
  const connect = async () => await producer.connect();

  const send = async (topic: string, message: object, key?: string) => {
    try {
      await producer.send({
        topic,
        messages: [{ key, value: JSON.stringify(message) }],
      });
      console.log(`📤 Message sent to ${topic}`);
    } catch (error) {
      console.error("Kafka send failed:", {
        topic,
        key,
        message,
        error,
      });

      throw error;
    }
  };
  const disconnect = async () => {
    await producer.disconnect();
  };

  return { connect, send, disconnect };
};
