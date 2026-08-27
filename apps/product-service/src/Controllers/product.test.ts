import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.KAFKA_BROKER = "localhost:9092";
process.env.CLERK_PUBLISHABLE_KEY = "pk_test_mock_12345";
process.env.CLERK_SECRET_KEY = "sk_test_mock_12345";

vi.mock("../utils/kafka.js", () => ({
  producer: {
    connect: vi.fn(),
    send: vi.fn().mockResolvedValue(true),
    disconnect: vi.fn(),
  },
  kafka: {},
}));

import request from "supertest";
import { prisma } from "@repo/productdb";
import { producer } from "../utils/kafka.js";
import app from "../index.js";

// 1. Mock de la base de datos (Prisma)

vi.mock("../Middleweare/AuthMiddleweare.js", () => ({
  shouldBeAdmin: (req: any, res: any, next: any) => next(),
}));
vi.mock("@repo/productdb", async () => {
  const { mockDeep } = await import("vitest-mock-extended");
  return {
    prisma: mockDeep(),
    Prisma: {
      SortOrder: {
        asc: "asc",
        desc: "desc",
      },
    },
  };
});

// 2. Mock del producer de Kafka
vi.mock("src/utils/kafka.js", () => ({
  producer: {
    send: vi.fn().mockResolvedValue(true),
  },
}));

describe("Product Controller API Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // CREATE PRODUCT
  // ==========================================
  describe("POST /api/products (createProduct)", () => {
    const validBody = {
      name: "Camiseta",
      price: 25.5,
      category: "ropa",
      colors: ["Red", "Blue"],
      images: { Red: "img1.jpg", Blue: "img2.jpg" },
    };

    it("✅ Debería crear un producto si la data es correcta y enviar evento a Kafka", async () => {
      const mockCreatedProduct = {
        id: 1,
        name: "Camiseta",
        price: 26, // Math.round(25.5)
        categorySlug: "ropa",
        colors: ["Red", "Blue"],
        images: { Red: "img1.jpg", Blue: "img2.jpg" },
      };

      (prisma.product.create as any).mockResolvedValue(mockCreatedProduct);

      const response = await request(app).post("/api/products").send(validBody);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCreatedProduct);
      expect(prisma.product.create).toHaveBeenCalledWith({
        data: {
          name: "Camiseta",
          price: 26,
          colors: ["Red", "Blue"],
          images: { Red: "img1.jpg", Blue: "img2.jpg" },
          categorySlug: "ropa",
        },
      });

      // Verificamos el envío a Kafka
      expect(producer.send).toHaveBeenCalledWith(
        "product.created",
        { id: "1", name: "Camiseta", price: 26 },
        "1",
      );
    });

    it("❌ Debería fallar si colors no es un array o está vacío", async () => {
      const response = await request(app)
        .post("/api/products")
        .send({ name: "Test", colors: [] });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Colors array is required");
    });

    it("❌ Debería fallar si images no es un objeto válido", async () => {
      const response = await request(app)
        .post("/api/products")
        .send({ name: "Test", colors: ["Red"], images: null });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Images are required");
    });

    it("❌ Debería fallar si falta una imagen para un color especificado", async () => {
      const response = await request(app)
        .post("/api/products")
        .send({
          name: "Test",
          colors: ["Red", "Green"],
          images: { Red: "img1.jpg" }, // Falta "Green"
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Missing image for color");
    });

    it("❌ Debería devolver 500 si Prisma falla", async () => {
      (prisma.product.create as any).mockRejectedValue(new Error("DB Error"));

      const response = await request(app).post("/api/products").send(validBody);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error creating product");
    });
  });

  // ==========================================
  // GET ALL PRODUCTS
  // ==========================================
  describe("GET /api/products (getAllProducts)", () => {
    it("✅ Debería obtener todos los productos sin query params", async () => {
      const mockProducts = [{ id: 1, name: "Camiseta", price: 20 }];
      (prisma.product.findMany as any).mockResolvedValue(mockProducts);

      const response = await request(app).get("/api/products");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: undefined,
        take: undefined,
      });
    });

    it("✅ Debería aplicar filtros de búsqueda, categoría, orden y límite", async () => {
      (prisma.product.findMany as any).mockResolvedValue([]);

      const response = await request(app).get(
        "/api/products?category=zapatillas&search=nike&sort=lowToHigh&limit=5",
      );

      expect(response.status).toBe(200);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: {
          category: {
            slug: { equals: "zapatillas", mode: "insensitive" },
          },
          name: {
            contains: "nike",
            mode: "insensitive",
          },
        },
        orderBy: { price: "asc" },
        take: 5,
      });
    });
  });

  // ==========================================
  // GET SINGLE PRODUCT
  // ==========================================
  describe("GET /api/products/singleProduct/:id (getProduct)", () => {
    it("✅ Debería obtener un producto por su ID", async () => {
      const mockProduct = { id: 1, name: "Camiseta", price: 20 };
      (prisma.product.findUnique as any).mockResolvedValue(mockProduct);

      // Usamos la ruta real definida en product.routes.ts
      const response = await request(app).get("/api/products/singleProduct/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProduct);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  // ==========================================
  // UPDATE PRODUCT
  // ==========================================
  describe("PUT /api/products/:id (updateProduct)", () => {
    it("✅ Debería actualizar un producto correctamente", async () => {
      const updateData = { name: "Camiseta Actualizada", price: 30 };
      const mockUpdatedProduct = { id: 1, ...updateData };

      (prisma.product.update as any).mockResolvedValue(mockUpdatedProduct);

      const response = await request(app)
        .put("/api/products/1")
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedProduct);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
    });

    it("❌ Debería devolver 404 si el producto no existe", async () => {
      (prisma.product.update as any).mockRejectedValue(
        new Error("Record not found"),
      );

      const response = await request(app)
        .put("/api/products/999")
        .send({ name: "No existo" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product not found");
    });
  });

  // ==========================================
  // DELETE PRODUCTS (BULK DELETE)
  // ==========================================
  describe("DELETE /api/products (deleteProduct)", () => {
    it("✅ Debería eliminar múltiples productos por array de IDs y notificar a Kafka", async () => {
      (prisma.product.deleteMany as any).mockResolvedValue({ count: 2 });

      const response = await request(app)
        .delete("/api/products")
        .send({ ids: [1, 2] });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "2 product(s) deleted successfully",
        deletedCount: 2,
      });

      expect(prisma.product.deleteMany).toHaveBeenCalledWith({
        where: {
          id: { in: [1, 2] },
        },
      });

      expect(producer.send).toHaveBeenCalledWith("product.deletedMany", {
        value: JSON.stringify({ ids: [1, 2], count: 2 }),
      });
    });

    it("❌ Debería devolver 400 si ids no es un array o está vacío", async () => {
      const response = await request(app)
        .delete("/api/products")
        .send({ ids: [] });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("An array of product IDs is required");
    });

    it("❌ Debería devolver 500 si falla la eliminación en DB", async () => {
      (prisma.product.deleteMany as any).mockRejectedValue(
        new Error("Database error"),
      );

      const response = await request(app)
        .delete("/api/products")
        .send({ ids: [1] });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Failed to delete products");
    });
  });
});
