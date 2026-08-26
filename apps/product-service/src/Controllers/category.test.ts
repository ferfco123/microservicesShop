import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { prisma } from "@repo/productdb";
import app from "../index.js";

// 1. Mock de Prisma
vi.mock("@repo/productdb", async () => {
  const { mockDeep } = await import("vitest-mock-extended");
  return {
    prisma: mockDeep(),
  };
});

// 2. Mock del Middleware de Autenticación
vi.mock("../Middleweare/AuthMiddleweare.js", () => ({
  shouldBeAdmin: (req: any, res: any, next: any) => next(),
}));

describe("Category Controller API Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // CREATE CATEGORY
  // ==========================================
  describe("POST /api/category (createCategory)", () => {
    it("✅ Debería crear una categoría si la data es válida", async () => {
      const newCategory = { name: "Ropa", slug: "ropa" };
      const mockCreatedCategory = { id: 1, ...newCategory };

      (prisma.category.create as any).mockResolvedValue(mockCreatedCategory);

      const response = await request(app)
        .post("/api/category")
        .send(newCategory);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCreatedCategory);
      expect(prisma.category.create).toHaveBeenCalledWith({
        data: newCategory,
      });
    });

    it("❌ Debería devolver 500 si falla la inserción en la DB", async () => {
      (prisma.category.create as any).mockRejectedValue(
        new Error("Database Error"),
      );

      const response = await request(app)
        .post("/api/category")
        .send({ name: "Error" });

      expect(response.status).toBe(500);
    });
  });

  // ==========================================
  // GET CATEGORIES
  // ==========================================
  describe("GET /api/category (getCatgories)", () => {
    it("✅ Debería obtener todas las categorías", async () => {
      const mockCategories = [
        { id: 1, name: "Electrónica", slug: "electronica" },
        { id: 2, name: "Ropa", slug: "ropa" },
      ];

      (prisma.category.findMany as any).mockResolvedValue(mockCategories);

      const response = await request(app).get("/api/category");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCategories);
      expect(prisma.category.findMany).toHaveBeenCalledTimes(1);
    });
  });

  // ==========================================
  // UPDATE CATEGORY
  // ==========================================
  describe("PUT /api/category/:id (updateCatgories)", () => {
    it("✅ Debería actualizar una categoría correctamente", async () => {
      const categoryId = 1;
      const updateData = { name: "Electrónica Actualizada" };
      const mockUpdatedCategory = {
        id: categoryId,
        name: "Electrónica Actualizada",
        slug: "electronica",
      };

      (prisma.category.update as any).mockResolvedValue(mockUpdatedCategory);

      const response = await request(app)
        .put(`/api/category/${categoryId}`)
        .send(updateData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockUpdatedCategory);
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: categoryId },
        data: updateData,
      });
    });

    it("❌ Debería devolver 500 si la categoría no existe", async () => {
      (prisma.category.update as any).mockRejectedValue(
        new Error("Record to update not found"),
      );

      const response = await request(app)
        .put("/api/category/999")
        .send({ name: "Inexistente" });

      expect(response.status).toBe(500);
    });
  });

  // ==========================================
  // DELETE CATEGORY
  // ==========================================
  describe("DELETE /api/category/:id (deleteCatgorie)", () => {
    it("✅ Debería eliminar una categoría correctamente", async () => {
      const categoryId = 1;

      (prisma.category.delete as any).mockResolvedValue({ id: categoryId });

      const response = await request(app).delete(`/api/category/${categoryId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Category has been deleted" });
      expect(prisma.category.delete).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
    });

    it("❌ Debería devolver 500 si la categoría no existe", async () => {
      (prisma.category.delete as any).mockRejectedValue(
        new Error("Record to delete not found"),
      );

      const response = await request(app).delete("/api/category/999");

      expect(response.status).toBe(500);
    });
  });
});
