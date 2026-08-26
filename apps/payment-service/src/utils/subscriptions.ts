import { consumer } from "./kafka.js";
import { createStripeProduct, deleteStripeProduct } from "./stripeProducts.js";

export const runKafkaSubscriptions = async () => {
  await consumer.subscribe([
    {
      topicName: "product.created",
      topicHandler: async (message) => {
        const product = message.value;
        if (!product || typeof product !== "object") {
          console.error("Invalid product.created payload", message.value);
          return;
        }
        console.log("kafka received product.created", product);
        await createStripeProduct(product);
      },
    },
    {
      topicName: "product.deleted",
      topicHandler: async (message) => {
        const productId = message.value;
        if (!productId?.id) {
          console.error("Invalid product.deleted payload", productId);
          return;
        }
        console.log("kafka received product.deleted", productId);
        await deleteStripeProduct(productId);
      },
    },
  ]);
};
