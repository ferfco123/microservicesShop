import { OrderType } from "@repo/types";
import { Order } from "@repo/orderdb";
import { producer } from "./kafka.js";

export const createOrder = async (order: OrderType) => {
  const newOrder = new Order(order);
  try {
    const existing = await Order.findOne({
      stripeSessionId: order.stripeSessionId,
    });

    if (existing) {
      console.log("Order already exists");
      return;
    }
    const savedOrder = await newOrder.save();
    await producer.send("order.created", {
      email: savedOrder.email,
      amount: savedOrder.ammount,
      status: savedOrder.status,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
