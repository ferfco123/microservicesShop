import { consumer } from "./kafka.js";
import { createOrder } from "./order.js";

export const runKafkaSubscriptions = async () => {
  await consumer.subscribe([
    {
      topicName: "payment.successful",
      topicHandler: async (message) => {
        try {
          let orderData;
          const rawValue = message.value;

          if (
            typeof rawValue === "object" &&
            !Buffer.isBuffer(rawValue) &&
            rawValue !== null
          ) {
            orderData = rawValue;
          } else if (Buffer.isBuffer(rawValue)) {
            orderData = JSON.parse(rawValue.toString("utf-8"));
          } else if (typeof rawValue === "string") {
            orderData = JSON.parse(rawValue);
          } else {
            throw new Error(
              `Tipo de dato no soportado en message.value: ${typeof rawValue}`,
            );
          }

          console.dir(orderData, { depth: null });

          const newOrder = await createOrder(orderData);
        } catch (error: any) {
          console.error(error.message || error);
        }
      },
    },
  ]);

  await consumer.run();
  console.log("Listening events...");
};
