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

    // Verificamos que se haya llamado a subscribe con el array de configuraciones
    expect(consumer.subscribe).toHaveBeenCalledTimes(1);

    const subscriptions = (consumer.subscribe as any).mock.calls[0][0];

    // Extraemos los handlers de product.created y product.deleted
    const createdSub = subscriptions.find(
      (s: any) => s.topicName === "product.created",
    );
    const deletedSub = subscriptions.find(
      (s: any) => s.topicName === "product.deleted",
    );

    expect(createdSub).toBeDefined();
    expect(deletedSub).toBeDefined();

    // 1. Test handler de product.created (Caso exitoso)
    const mockProduct = { id: "123", name: "Notebook" };
    await createdSub.topicHandler({ value: mockProduct });
    expect(createStripeProduct).toHaveBeenCalledWith(mockProduct);

    // 2. Test handler de product.created (Caso inválido para cobertura)
    await createdSub.topicHandler({ value: null });

    // 3. Test handler de product.deleted (Caso exitoso)
    const mockId = { id: "123" };
    await deletedSub.topicHandler({ value: mockId });
    expect(deleteStripeProduct).toHaveBeenCalledWith(mockId);

    // 4. Test handler de product.deleted (Caso inválido para cobertura)
    await deletedSub.topicHandler({ value: {} });
  });
});
