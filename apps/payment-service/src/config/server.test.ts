import { describe, it, expect, vi } from "vitest";
process.env.KAFKA_BROKER = "localhost:9092";
process.env.STRIPE_SECRET_KEY = "sk_test_mock";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_mock";
// Mockeamos el servidor HTTP para que no abra un puerto ni bloquee el proceso
vi.mock("@hono/node-server", () => ({
  serve: vi.fn(),
}));

describe("Server Entry Point", () => {
  it("Debería inicializar el servidor sin errores", async () => {
    // Seteamos las variables de entorno para que Hono/Clerk no exploten
    process.env.PORT = "3001";
    process.env.STRIPE_SECRET_KEY = "sk_test_mock";
    process.env.CLERK_PUBLISHABLE_KEY = "pk_test_mock";
    process.env.KAFKA_BROKER = "localhost:9092";

    // Importamos dinámicamente el archivo server
    const server = await import("./server.js");

    expect(server).toBeDefined();
  }, 15000); // Se amplía el timeout a 15 segundos
});
