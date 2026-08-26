import cron from "node-cron";
import { generateRandomOrders } from "./seedData.js";

export const initOrderCron = () => {
  // Ejecuta todos los días a las 00:00
  cron.schedule("0 0 * * *", async () => {
    await generateRandomOrders();
  });
};
