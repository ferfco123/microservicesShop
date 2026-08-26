import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response, NextFunction } from "express";
import { shouldBeUser, shouldBeAdmin } from "./AuthMiddleweare.js";
import { getAuth } from "@clerk/express";

// Mock de @clerk/express
vi.mock("@clerk/express", () => ({
  getAuth: vi.fn(),
  clerkClient: {},
}));

describe("Auth Middleware Tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {};
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  // ==========================================
  // shouldBeUser
  // ==========================================
  describe("shouldBeUser", () => {
    it("❌ Debería devolver 401 si el usuario no está logueado", async () => {
      (getAuth as any).mockReturnValue({});

      await shouldBeUser(req as any, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Not logged in" });
      expect(next).not.toHaveBeenCalled();
    });

    it("✅ Debería agregar userId a req y llamar a next() si el usuario está logueado", async () => {
      (getAuth as any).mockReturnValue({ userId: "user_123" });

      await shouldBeUser(req as any, res as Response, next);

      expect((req as any).userId).toBe("user_123");
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  // ==========================================
  // shouldBeAdmin
  // ==========================================
  describe("shouldBeAdmin", () => {
    it("❌ Debería devolver 401 si no hay token/userId", async () => {
      (getAuth as any).mockReturnValue({});

      await shouldBeAdmin(req as any, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Not logged in" });
      expect(next).not.toHaveBeenCalled();
    });

    it("❌ Debería devolver 401/403 si el rol no es admin", async () => {
      (getAuth as any).mockReturnValue({
        userId: "user_123",
        sessionClaims: { metadata: { role: "customer" } },
      });

      await shouldBeAdmin(req as any, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401); // O 403 si lo actualizaste
      expect(res.json).toHaveBeenCalledWith({
        message: "You are not authtorized",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("✅ Debería llamar a next() si el usuario es admin", async () => {
      (getAuth as any).mockReturnValue({
        userId: "admin_123",
        sessionClaims: { metadata: { role: "admin" } },
      });

      await shouldBeAdmin(req as any, res as Response, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
