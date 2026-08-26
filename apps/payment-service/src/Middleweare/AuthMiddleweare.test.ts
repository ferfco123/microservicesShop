import { describe, it, expect, vi } from "vitest";
import { Hono } from "hono";
import { shouldBeAdmin, shouldBeUser } from "./AuthMiddleweare.js";

vi.mock("@hono/clerk-auth", () => ({
  getAuth: vi.fn(),
}));

describe("Auth Middleware", () => {
  it("Debería retornar 401 si Clerk no devuelve un userId", async () => {
    const { getAuth } = await import("@hono/clerk-auth");

    (getAuth as any).mockReturnValue({ userId: null });

    const app = new Hono();
    app.use("/test", shouldBeUser);
    app.get("/test", (c) => c.text("OK"));

    const res = await app.request("/test");

    expect(res.status).toBe(401);
  });

  it("Debería dejar pasar (200) si Clerk devuelve un userId", async () => {
    const { getAuth } = await import("@hono/clerk-auth");

    (getAuth as any).mockReturnValue({ userId: "user_fake_123" });

    const app = new Hono();
    app.use("/test", shouldBeUser);
    app.get("/test", (c) => c.text("Acceso Permitido"));

    const res = await app.request("/test");

    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toBe("Acceso Permitido");
  });
});

it("shouldBeAdmin - Debería retornar 403 si el usuario no es admin", async () => {
  const { getAuth } = await import("@hono/clerk-auth");

  (getAuth as any).mockReturnValue({
    userId: "user_123",
    sessionClaims: { role: "user" },
  });

  const app = new Hono();
  app.use("/admin", shouldBeAdmin);
  app.get("/admin", (c) => c.text("OK"));

  const res = await app.request("/admin");
  expect(res.status).toBe(403);
});

it("shouldBeAdmin - Debería dejar pasar si el usuario es admin", async () => {
  const { getAuth } = await import("@hono/clerk-auth");

  (getAuth as any).mockReturnValue({
    userId: "admin_123",
    sessionClaims: { role: "admin" },
  });

  const app = new Hono();
  app.use("/admin", shouldBeAdmin);
  app.get("/admin", (c) => c.text("Welcome Admin"));

  const res = await app.request("/admin");
  expect(res.status).toBe(200);
});

it("shouldBeAdmin - Debería retornar 401 si no hay userId (Cubre línea 28)", async () => {
  const { getAuth } = await import("@hono/clerk-auth");

  (getAuth as any).mockReturnValue({
    userId: null,
    sessionClaims: null,
  });

  const app = new Hono();
  app.use("/admin-test", shouldBeAdmin);
  app.get("/admin-test", (c) => c.text("No debería llegar aquí"));

  const res = await app.request("/admin-test");

  expect(res.status).toBe(401);
  const body = await res.json();
  expect(body.message).toBe("You are not logged in.");
});
