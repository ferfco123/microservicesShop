import { describe, it, expect, vi, beforeEach } from "vitest";

import * as ClerkFastify from "@clerk/fastify";
import { shouldBeAdmin, shouldBeUser } from "./AuthMiddleweare.js";

vi.mock("@clerk/fastify", () => ({
  getAuth: vi.fn(),
}));

describe("Auth Middleware", () => {
  let mockRequest: any;
  let mockReply: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRequest = {};
    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
  });

  describe("shouldBeUser", () => {
    it("✅ Debería permitir el paso si existe userId", async () => {
      vi.mocked(ClerkFastify.getAuth).mockReturnValue({
        userId: "user_123",
      } as any);

      await shouldBeUser(mockRequest, mockReply);

      expect(mockRequest.userId).toBe("user_123");
      expect(mockReply.status).not.toHaveBeenCalled();
    });

    it("❌ Debería devolver 401 si no hay userId", async () => {
      vi.mocked(ClerkFastify.getAuth).mockReturnValue({ userId: null } as any);

      await shouldBeUser(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: "User not authenticated",
      });
    });
  });

  describe("shouldBeAdmin", () => {
    it("✅ Debería permitir el paso si el rol es admin", async () => {
      vi.mocked(ClerkFastify.getAuth).mockReturnValue({
        userId: "admin_123",
        sessionClaims: { metadata: { role: "admin" } },
      } as any);

      await shouldBeAdmin(mockRequest, mockReply);

      expect(mockReply.status).not.toHaveBeenCalled();
    });

    it("❌ Debería devolver 403 si el rol no es admin", async () => {
      vi.mocked(ClerkFastify.getAuth).mockReturnValue({
        userId: "user_123",
        sessionClaims: { metadata: { role: "user" } },
      } as any);

      await shouldBeAdmin(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(403);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: "You are not authorized",
      });
    });

    it("❌ Debería devolver 401 si no está autenticado", async () => {
      vi.mocked(ClerkFastify.getAuth).mockReturnValue({ userId: null } as any);

      await shouldBeAdmin(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(401);
    });
  });
});
