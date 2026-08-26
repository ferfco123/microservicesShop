import { vi, it, expect, describe, beforeEach, beforeAll } from "vitest";
import app from "../index.js";

vi.mock("../utils/stripe.js", () => ({
  default: {
    webhooks: {
      constructEvent: vi.fn(),
    },
    checkout: {
      sessions: {
        listLineItems: vi.fn(),
      },
    },
  },
}));

vi.mock("../utils/kafka.js", () => ({
  producer: {
    send: vi.fn().mockResolvedValue({}),
  },
}));

describe("Stripe Webhooks Controller", () => {
  beforeAll(() => {
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_secret";
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("Debería procesar 'checkout.session.completed' y enviar evento a Kafka", async () => {
    const { default: stripe } = await import("../utils/stripe.js");
    const { producer } = await import("../utils/kafka.js");

    const mockSession = {
      id: "cs_test_1",
      client_reference_id: "user_123",
      customer_details: { email: "usuario@test.com" },
      amount_total: 5000,
      payment_status: "paid",
    };

    const mockEvent = {
      type: "checkout.session.completed",
      data: {
        object: mockSession,
      },
    };

    (stripe.webhooks.constructEvent as any).mockReturnValue(mockEvent);
    (stripe.checkout.sessions.listLineItems as any).mockResolvedValue({
      data: [
        {
          description: "Suscripción",
          quantity: 1,
          price: {
            unit_amount: 5000,
            product: { metadata: {} },
          },
        },
      ],
    });

    const res = await app.request("/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "valid_sig" },
      body: JSON.stringify(mockEvent),
    });

    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({ received: true });

    expect(producer.send).toHaveBeenCalledWith("payment.successful", {
      stripeSessionId: "cs_test_1",
      userId: "user_123",
      email: "usuario@test.com",
      ammount: 50,
      status: "pending",
      shippingAddress: "No shipping address",
      products: [
        {
          name: "Suscripción",
          quantity: 1,
          price: 50,
          size: null,
          color: null,
          category: null,
        },
      ],
    });
  });

  it("Debería fallar con 400 si la firma es inválida", async () => {
    const { default: stripe } = await import("../utils/stripe.js");

    (stripe.webhooks.constructEvent as any).mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    const res = await app.request("/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "invalid_sig" },
      body: JSON.stringify({}),
    });

    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data).toEqual({
      message: "Webhook verification failed Invalid signature",
    });
  });

  it("Debería responder 200 para eventos no manejados sin llamar a Kafka", async () => {
    const { default: stripe } = await import("../utils/stripe.js");
    const { producer } = await import("../utils/kafka.js");

    (stripe.webhooks.constructEvent as any).mockReturnValue({
      type: "other.event",
      data: { object: {} },
    });

    const res = await app.request("/webhooks/stripe", {
      method: "POST",
      headers: { "stripe-signature": "valid_sig" },
      body: JSON.stringify({}),
    });

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual({ received: true });
    expect(producer.send).not.toHaveBeenCalled();
  });
});
