import { Order, OrderSchemaType } from "@repo/orderdb";
import cron from "node-cron";
import { products, users } from "./data.js";

function getRandomElement<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error("El array no puede estar vacío.");
  }
  return array[Math.floor(Math.random() * array.length)] as T;
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function generateRandomOrders() {
  const ordersToCreateCount = getRandomNumber(2, 4);
  const createdOrders = [];

  for (let i = 0; i < ordersToCreateCount; i++) {
    const randomUser = getRandomElement(users);

    const itemsCount = getRandomNumber(1, 3);
    const orderProducts = [];
    let calculatedAmount = 0;

    for (let j = 0; j < itemsCount; j++) {
      const randomProduct = getRandomElement(products);
      const quantity = getRandomNumber(1, 3);
      const selectedSize = getRandomElement(randomProduct.sizes);
      const selectedColor = getRandomElement(randomProduct.colors);

      calculatedAmount += randomProduct.price * quantity;

      orderProducts.push({
        name: randomProduct.name,
        quantity,
        price: randomProduct.price,
        size: selectedSize,
        color: selectedColor,
        category: randomProduct.categorySlug,
      });
    }

    const statuses: Array<"delivered" | "pending" | "paid"> = [
      "delivered",
      "pending",
      "paid",
    ];

    const newOrderData: Partial<OrderSchemaType> = {
      stripeSessionId: `cs_test_${Math.random().toString(36).substring(2, 15)}`,
      email: randomUser.email,
      userId: randomUser.id,
      ammount: calculatedAmount,
      status: getRandomElement(statuses),
      products: orderProducts,
      shippingAddress: randomUser.shippingAddress,
    } as unknown as OrderSchemaType;

    createdOrders.push(newOrderData);
  }

  try {
    await Order.insertMany(createdOrders);
    console.log(
      `[CRON] Se generaron exitosamente ${createdOrders.length} órdenes.`,
    );
  } catch (error) {
    console.error("[CRON] Error al insertar órdenes simuladas:", error);
  }
}
