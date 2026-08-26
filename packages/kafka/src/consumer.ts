import type { Consumer, Kafka } from "kafkajs";

export const createConsumer = (kafka: Kafka, groupId: string) => {
  const consumer: Consumer = kafka.consumer({ groupId });
  const handlers: Record<string, (message: any) => Promise<void>> = {};
  const MAX_RETRIES = 3;
  const connect = async () => {
    await consumer.connect();
    console.log("Kafka consumer connected to", groupId);
  };

  const subscribe = async (
    topics: {
      topicName: string;
      topicHandler: (message: any) => Promise<void>;
    }[],
  ) => {
    for (const { topicName, topicHandler } of topics) {
      if (handlers[topicName]) {
        throw new Error(`Handler already registered for ${topicName}`);
      }
      handlers[topicName] = topicHandler;

      await consumer.subscribe({
        topic: topicName,
        fromBeginning: false,
      });
    }
  };

  const run = async () => {
    await consumer.run({
      partitionsConsumedConcurrently: 1,
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const handler = handlers[topic];

          if (!handler) {
            console.warn(`No handler for topic ${topic}`);
            return;
          }

          const value = message.value?.toString();
          if (!value) return;

          let parsed;

          try {
            parsed = JSON.parse(value);
          } catch (err) {
            console.error("Invalid JSON message", { value });

            return;
          }

          let attempts = 0;
          while (attempts < MAX_RETRIES) {
            try {
              await handler({
                topic,
                partition,
                offset: message.offset,
                key: message.key?.toString(),
                value: parsed,
              });

              break;
            } catch (err) {
              attempts++;

              console.error(`Handler failed (attempt ${attempts})`, {
                topic,
                offset: message.offset,
                err,
              });

              if (attempts >= MAX_RETRIES) {
                console.error("Max retries reached, giving up");
                return;
              }
            }
          }
        } catch (error) {
          console.error("Error processing message:", {
            topic,
            partition,
            offset: message.offset,
            key: message.key?.toString(),
            value: message.value?.toString(),
            error,
          });
          throw error;
        }
      },
    });
  };

  const disconnect = async () => {
    await consumer.disconnect();
  };

  return { connect, subscribe, run, disconnect };
};
