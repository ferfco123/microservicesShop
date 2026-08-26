import { sendEmail } from "./email.js";
import { consumer } from "./kafka.js";

export const runKafkaSubscriptions = async () => {
  await consumer.subscribe([
    {
      topicName: "user.created",
      topicHandler: async (message) => {
        console.log("kafka received user.created", message);

        const { username, email } = message.value;
        if (email) {
          await sendEmail({
            email,
            subject: "Welcome to ecommerce app",
            text: `Welcome ${username} your account has been created`,
          });
        }
      },
    },
    {
      topicName: "order.created",
      topicHandler: async (message) => {
        console.log("kafka received order.created", message);

        const { email, ammount, status } = message.value;
        if (email) {
          await sendEmail({
            email,
            subject: "Order Created",
            text: `We have received your order for total amount of ${ammount / 100}. Status: ${status}`,
          });
        }
      },
    },
  ]);
};
