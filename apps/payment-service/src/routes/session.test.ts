import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";
import sessionRoute from "./sessions.routes.js";
import stripe from "../utils/stripe.js";
import { getStripProductPrice } from "../utils/stripeProducts.js";

vi.mock("@hono/clerk-auth", () => ({
  clerkMiddleware: () => async (c: any, next: any) => await next(),
  getAuth: vi.fn(() => ({ userId: "user_mock_123" })),
}));

vi.mock("../utils/stripe.js", () => ({
  default: {
    checkout: {
      sessions: {
        create: vi.fn(),
        retrieve: vi.fn(),
      },
    },
  },
}));

vi.mock("../utils/stripeProducts.js", () => ({
  getStripProductPrice: vi.fn(),
}));

vi.mock("../Middleweare/AuthMiddleweare.js", () => ({
  shouldBeUser: async (c: any, next: any) => {
    c.set("userId", "user_123");
    await next();
  },
}));

describe("Session Routes Tests", () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono();
    app.route("/session", sessionRoute);
    vi.clearAllMocks();

    // Silenciamos logs de consola durante la ejecución
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("POST /session/create-checkout-session - Debería crear una sesión de Stripe", async () => {
    vi.mocked(getStripProductPrice).mockResolvedValue(2000);
    vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
      client_secret: "secret_123",
    } as any);

    const res = await app.request("/session/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({
        cart: [{ id: "prod_1", name: "Laptop", quantity: 1 }],
      }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual({ checkoutSessionClientsecret: "secret_123" });
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        client_reference_id: "user_123",
        mode: "payment",
      }),
    );
  });

  it("GET /session/:sessionId - Debería recuperar el estado de la sesión con sus detalles", async () => {
    vi.mocked(stripe.checkout.sessions.retrieve).mockResolvedValue({
      status: "complete",
      payment_status: "paid",
      customer_details: {
        email: "test@example.com",
        name: "Test User",
      },
      amount_total: 5000,
      currency: "usd",
      line_items: {
        data: [
          {
            id: "li_1",
            description: "Laptop",
            quantity: 1,
            amount_total: 5000,
          },
        ],
      },
    } as any);

    const res = await app.request("/session/sess_abc123");
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({
      status: "complete",
      paymentStatus: "paid",
      customerEmail: "test@example.com",
      customerName: "Test User",
      amountTotal: 50,
      currency: "USD",
      items: [
        {
          id: "li_1",
          description: "Laptop",
          quantity: 1,
          amount: 50,
        },
      ],
    });

    // Aserción con la lista completa de parámetros expandidos en la API
    expect(stripe.checkout.sessions.retrieve).toHaveBeenCalledWith(
      "sess_abc123",
      {
        expand: ["payment_intent", "line_items"],
      },
    );
  });

  it("POST /session/create-checkout-session - Debería capturar el error si Stripe falla", async () => {
    vi.mocked(getStripProductPrice).mockResolvedValue(2000);
    vi.mocked(stripe.checkout.sessions.create).mockRejectedValue(
      new Error("Stripe Error"),
    );

    const res = await app.request("/session/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({
        cart: [{ id: "prod_1", name: "Test", quantity: 1 }],
      }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data).toEqual({ error: "Stripe Error" });
  });

  it("POST /session/create-checkout-session - Debería retornar 400 si el carrito está vacío", async () => {
    const res = await app.request("/session/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({ cart: [] }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data).toEqual({
      error: "El carrito está vacío o el formato es inválido.",
    });
  });
});
