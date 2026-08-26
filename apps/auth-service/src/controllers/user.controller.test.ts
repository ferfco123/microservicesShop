import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response, NextFunction } from "express";
import {
  getUsers,
  getUser,
  deleteUser,
  createUser,
  updateUser,
} from "./UserControllers.js";
import { clerkClient } from "../index.js";
import { producer } from "src/utils/kafka.js";

// Mock de Clerk
vi.mock("../index.js", () => ({
  clerkClient: {
    users: {
      getUserList: vi.fn(),
      getUser: vi.fn(),
      deleteUser: vi.fn(),
      createUser: vi.fn(),
      updateUser: vi.fn(),
    },
  },
}));

// Mock del Producer de Kafka
vi.mock("src/utils/kafka.js", () => ({
  producer: {
    send: vi.fn(),
  },
}));

describe("User Controller Tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    // Silenciar console.log y console.error para mantener limpia la consola en tests
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "dir").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    req = { query: {}, params: {}, body: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  // ==========================================
  // getUsers
  // ==========================================
  describe("getUsers", () => {
    it("✅ Debería retornar usuarios simplificados y totalCount", async () => {
      req.query = { limit: "10", offset: "0", search: "John" };

      const mockClerkResponse = {
        data: [
          {
            id: "user_1",
            firstName: "John",
            lastName: "Doe",
            imageUrl: "http://avatar.png",
            primaryEmailAddressId: "email_1",
            emailAddresses: [
              { id: "email_1", emailAddress: "john@example.com" },
            ],
            publicMetadata: { role: "admin" },
          },
        ],
        totalCount: 1,
      };

      vi.mocked(clerkClient.users.getUserList).mockResolvedValue(
        mockClerkResponse as any,
      );

      await getUsers(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [
          {
            id: "user_1",
            fullName: "John Doe",
            email: "john@example.com",
            avatar: "http://avatar.png",
            role: "admin",
          },
        ],
        totalCount: 1,
      });
    });

    it("❌ Debería llamar a next(error) si Clerk falla", async () => {
      const error = new Error("Clerk error");
      vi.mocked(clerkClient.users.getUserList).mockRejectedValue(error);

      await getUsers(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // ==========================================
  // getUser
  // ==========================================
  describe("getUser", () => {
    it("❌ Debería devolver 400 si no se provee ID", async () => {
      req.params = {};

      await getUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User ID is required" });
    });

    it("✅ Debería devolver 200 y la información del usuario", async () => {
      req.params = { id: "user_123" };
      const mockUser = { id: "user_123", firstName: "John" };
      vi.mocked(clerkClient.users.getUser).mockResolvedValue(mockUser as any);

      await getUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
  });

  // ==========================================
  // deleteUser
  // ==========================================
  describe("deleteUser", () => {
    it("❌ Debería devolver 400 si 'ids' no es un array válido", async () => {
      req.body = { ids: "invalid_id" };

      await deleteUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Ids are required" });
    });

    it("✅ Debería eliminar múltiples usuarios y devolver 201", async () => {
      req.body = { ids: ["user_1", "user_2"] };
      vi.mocked(clerkClient.users.deleteUser).mockResolvedValue({} as any);

      await deleteUser(req as Request, res as Response);

      expect(clerkClient.users.deleteUser).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "2 users deleted" });
    });
  });

  // ==========================================
  // createUser
  // ==========================================
  describe("createUser", () => {
    it("❌ Debería devolver 400 si faltan emailAddress o password", async () => {
      req.body = { emailAddress: "test@example.com" }; // Sin password

      await createUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email and password are required",
      });
    });

    it("✅ Debería crear un usuario en Clerk y enviar evento a Kafka", async () => {
      req.body = {
        emailAddress: "test@example.com",
        password: "password123",
        username: "testuser",
        firstName: "Test",
      };

      const mockNewUser = {
        id: "user_new",
        username: "testuser",
        emailAddresses: [{ emailAddress: "test@example.com" }],
      };

      vi.mocked(clerkClient.users.createUser).mockResolvedValue(
        mockNewUser as any,
      );

      await createUser(req as Request, res as Response);

      expect(clerkClient.users.createUser).toHaveBeenCalledWith({
        emailAddress: ["test@example.com"],
        password: "password123",
        firstName: "Test",
        lastName: undefined,
        username: "testuser",
        skipPasswordChecks: false,
      });

      expect(producer.send).toHaveBeenCalledWith("user.created", {
        username: "testuser",
        email: "test@example.com",
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockNewUser);
    });

    it("❌ Debería capturar el error de Clerk y devolver 400", async () => {
      req.body = { emailAddress: "test@example.com", password: "123" };

      const clerkError = {
        errors: [{ longMessage: "Password is too short" }],
      };
      vi.mocked(clerkClient.users.createUser).mockRejectedValue(clerkError);

      await createUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Password is too short",
        errors: clerkError.errors,
      });
    });
  });

  // ==========================================
  // updateUser
  // ==========================================
  describe("updateUser", () => {
    it("❌ Debería devolver 400 si no se provee id", async () => {
      req.params = {};

      await updateUser(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User ID is required" });
    });

    it("✅ Debería actualizar el usuario y devolver 200", async () => {
      req.params = { id: "user_123" };
      req.body = { firstName: "Jane", role: "admin" };

      const mockUpdatedUser = {
        id: "user_123",
        firstName: "Jane",
        publicMetadata: { role: "admin" },
      };

      vi.mocked(clerkClient.users.updateUser).mockResolvedValue(
        mockUpdatedUser as any,
      );

      await updateUser(req as Request, res as Response, next);

      expect(clerkClient.users.updateUser).toHaveBeenCalledWith("user_123", {
        firstName: "Jane",
        publicMetadata: { role: "admin" },
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedUser);
    });

    it("❌ Debería llamar a next(error) si la actualización falla", async () => {
      req.params = { id: "user_123" };
      const error = new Error("Update failed");
      vi.mocked(clerkClient.users.updateUser).mockRejectedValue(error);

      await updateUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
