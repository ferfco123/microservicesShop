import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  beforeAll,
  afterAll,
} from "vitest";
import Fastify, { FastifyInstance } from "fastify";
import orderRoutes from "./routes.orders.js";
import { Order } from "@repo/orderdb";

// Mock de la base de datos (Order model)
vi.mock("@repo/orderdb", () => ({
  Order: {
    find: vi.fn(),
    countDocuments: vi.fn(), // 🟢 Se agrega el mock de countDocuments
    aggregate: vi.fn(),
    deleteMany: vi.fn(),
  },
}));

// Mock de los middlewares de autenticación
vi.mock("../Middleweare/AuthMiddleweare.js", () => ({
  shouldBeUser: vi.fn(async (req) => {
    req.userId = "user_test_123";
  }),
  shouldBeAdmin: vi.fn(async (req) => {
    req.userId = "admin_test_123";
  }),
}));

describe("Order Routes Tests", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = Fastify();
    await app.register(orderRoutes);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // GET / (Obtener órdenes del usuario)
  // ==========================================
  describe("GET /", () => {
    it("✅ Debería devolver 200 con las órdenes paginadas del usuario logueado", async () => {
      const mockOrders = [
        { _id: "order_1", userId: "user_test_123", total: 100 },
      ];

      // 🟢 Mock de la cadena de métodos Mongoose (.skip().limit())
      const mockQueryChain = {
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue(mockOrders),
      };

      vi.mocked(Order.find).mockReturnValue(mockQueryChain as any);
      vi.mocked(Order.countDocuments).mockResolvedValue(1);

      const response = await app.inject({
        method: "GET",
        url: "/?page=1",
      });

      expect(response.statusCode).toBe(200);

      // 🟢 Verificación de la nueva estructura de respuesta
      expect(JSON.parse(response.payload)).toEqual({
        orders: mockOrders,
        pagination: {
          totalOrders: 1,
          totalPages: 1,
          currentPage: 1,
          limit: 10,
        },
      });

      expect(Order.find).toHaveBeenCalledWith({ userId: "user_test_123" });
      expect(mockQueryChain.skip).toHaveBeenCalledWith(0);
      expect(mockQueryChain.limit).toHaveBeenCalledWith(10);
      expect(Order.countDocuments).toHaveBeenCalledWith({
        userId: "user_test_123",
      });
    });

    it("❌ Debería devolver 500 si la base de datos falla", async () => {
      // 🟢 Mock del fallo en el find dentro de Promise.all
      vi.mocked(Order.find).mockImplementation(() => {
        throw new Error("DB Error");
      });

      const response = await app.inject({
        method: "GET",
        url: "/",
      });

      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.payload)).toEqual({
        error: "Error getting orders",
      });
    });
  });

  // ==========================================
  // GET /allOrders (Admin: Listar todas las órdenes)
  // ==========================================
  describe("GET /allOrders", () => {
    it("✅ Debería devolver todas las órdenes filtrando por query params", async () => {
      const mockOrders = [{ _id: "order_1", email: "test@example.com" }];
      const mockQueryChain = {
        sort: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue(mockOrders),
      };

      vi.mocked(Order.find).mockReturnValue(mockQueryChain as any);
      vi.mocked(Order.countDocuments).mockResolvedValue(1);

      const response = await app.inject({
        method: "GET",
        url: "/allOrders?limit=10&search=test",
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toEqual(mockOrders);
      expect(Order.find).toHaveBeenCalledWith({
        email: { $regex: "test", $options: "i" },
      });
      expect(mockQueryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockQueryChain.limit).toHaveBeenCalledWith(10);
    });

    it("❌ Debería devolver 500 si falla la consulta", async () => {
      vi.mocked(Order.find).mockImplementation(() => {
        throw new Error("DB Error");
      });

      const response = await app.inject({
        method: "GET",
        url: "/allOrders",
      });

      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.payload)).toEqual({
        error: "Error getting orders",
      });
    });
  });

  // ==========================================
  // GET /order-chart (Admin: Métricas de los últimos 6 meses)
  // ==========================================
  describe("GET /order-chart", () => {
    it("✅ Debería estructurar y devolver los datos de los últimos 6 meses", async () => {
      const mockAggregate = [
        { total: 5, successfull: 3, year: 2026, month: 8 },
      ];
      vi.mocked(Order.aggregate).mockResolvedValue(mockAggregate);

      const response = await app.inject({
        method: "GET",
        url: "/order-chart",
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);

      expect(data).toHaveLength(6);
      expect(data[0]).toHaveProperty("month");
      expect(data[0]).toHaveProperty("total");
      expect(data[0]).toHaveProperty("successful");
      expect(Order.aggregate).toHaveBeenCalledTimes(1);
    });

    it("❌ Debería devolver 500 si ocurre un error en la agregación", async () => {
      vi.mocked(Order.aggregate).mockRejectedValue(
        new Error("Aggregation Error"),
      );

      const response = await app.inject({
        method: "GET",
        url: "/order-chart",
      });

      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.payload)).toEqual({
        error: "Error getting orders",
      });
    });
  });

  // ==========================================
  // DELETE / (Admin: Eliminar órdenes por IDs)
  // ==========================================
  describe("DELETE /", () => {
    it("❌ Debería devolver 400 si no se proporciona un array de IDs válido", async () => {
      const response = await app.inject({
        method: "DELETE",
        url: "/",
        payload: { ids: [] },
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.payload)).toEqual({
        error: "An array of order IDs is required",
      });
    });

    it("✅ Debería eliminar las órdenes recibidas y devolver 200", async () => {
      vi.mocked(Order.deleteMany).mockResolvedValue({
        acknowledged: true,
        deletedCount: 2,
      } as any);

      const response = await app.inject({
        method: "DELETE",
        url: "/",
        payload: { ids: ["id_1", "id_2"] },
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toEqual({
        message: "2 order(s) deleted successfully",
        deletedCount: 2,
      });
      expect(Order.deleteMany).toHaveBeenCalledWith({
        _id: { $in: ["id_1", "id_2"] },
      });
    });

    it("❌ Debería devolver 500 si falla la eliminación en DB", async () => {
      vi.mocked(Order.deleteMany).mockRejectedValue(new Error("Delete error"));

      const response = await app.inject({
        method: "DELETE",
        url: "/",
        payload: { ids: ["id_1"] },
      });

      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.payload)).toEqual({
        error: "Error deleting orders",
      });
    });
  });
});
