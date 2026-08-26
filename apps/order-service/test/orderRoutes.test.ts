import { describe, it, expect, vi, beforeEach } from "vitest";
import Fastify, { FastifyInstance } from "fastify";
import orderRoutes from "../src/routes/routes.orders.js";
import { Order } from "@repo/orderdb";

vi.mock("@repo/orderdb", () => ({
  Order: {
    find: vi.fn(),
  },
}));

vi.mock("../src/Middleweare/AuthMiddleweare.js", () => ({
  shouldBeUser: vi.fn((request, reply, done) => {
    request.userId = "test-user-id";
    done();
  }),
  shouldBeAdmin: vi.fn((request, reply, done) => {
    done();
  }),
}));

describe("Order Routes", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = Fastify();
    app.register(orderRoutes, { prefix: "/api/orders" });
    await app.ready();
  });

  it("✅ Debería obtener las órdenes del usuario autenticado (GET /)", async () => {
    const mockOrders = [{ userId: "test-user-id", total: 100 }];
    vi.mocked(Order.find).mockResolvedValue(mockOrders);

    const response = await app.inject({
      method: "GET",
      url: "/api/orders/",
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual(mockOrders);
    expect(Order.find).toHaveBeenCalledWith({ userId: "test-user-id" });
  });

  it("✅ Debería obtener todas las órdenes (GET /allOrders)", async () => {
    const mockOrders = [
      { userId: "user1", total: 50 },
      { userId: "user2", total: 150 },
    ];
    vi.mocked(Order.find).mockResolvedValue(mockOrders);

    const response = await app.inject({
      method: "GET",
      url: "/api/orders/allOrders",
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual(mockOrders);
    expect(Order.find).toHaveBeenCalledWith();
  });

  it("❌ Debería devolver 500 si falla la base de datos en GET /", async () => {
    vi.mocked(Order.find).mockRejectedValue(new Error("DB Error"));

    const response = await app.inject({
      method: "GET",
      url: "/api/orders/",
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.payload)).toEqual({
      error: "Error getting orders",
    });
  });

  it("❌ Debería devolver 500 si falla la base de datos en GET /allOrders", async () => {
    vi.mocked(Order.find).mockRejectedValue(new Error("DB Error"));

    const response = await app.inject({
      method: "GET",
      url: "/api/orders/allOrders",
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.payload)).toEqual({
      error: "Error getting orders",
    });
  });
});
