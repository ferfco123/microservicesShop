import { describe, it, expect, vi } from "vitest";
import { runKafkaSubscriptions } from "./subscriptions.js";
import { consumer } from "./kafka.js";
import { createStripeProduct, deleteStripeProduct } from "./stripeProducts.js";

vi.mock("./kafka", () => ({
  consumer: {
    subscribe: vi.fn(),
  },
}));

vi.mock("./stripeProducts", () => ({
  createStripeProduct: vi.fn(),
  deleteStripeProduct: vi.fn(),
}));

describe("Kafka Subscriptions", () => {
  it("Debería registrar los suscriptores y procesar mensajes (100% Coverage)", async () => {
    await runKafkaSubscriptions();

    const createCallback = (consumer.subscribe as any).mock.calls[0][1];

    const deleteCallback = (consumer.subscribe as any).mock.calls[1][1];

    const mockProduct = { value: { id: "123", name: "Notebook" } };
    await createCallback(mockProduct);
    expect(createStripeProduct).toHaveBeenCalledWith(mockProduct.value);

    const mockId = { value: "123" };
    await deleteCallback(mockId);
    expect(deleteStripeProduct).toHaveBeenCalledWith(mockId.value);
  });
});
