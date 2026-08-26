import { describe, it, expect, vi } from "vitest";

describe("Server Entry Point", () => {
  it("Debería inicializar el servidor sin errores", async () => {
    // Seteamos las variables de entorno para que Hono/Clerk no exploten
    process.env.PORT = "3001";
    process.env.STRIPE_SECRET_KEY = "sk_test_mock";
    process.env.CLERK_PUBLISHABLE_KEY = "pk_test_mock";
    process.env.KAFKA_BROKER = "localhost:9092";

    // Importamos dinámicamente el archivo server
    // Esto ejecutará las líneas 7-28 (app.use, app.route, etc.)
    const server = await import("./server.js");

    expect(server).toBeDefined();
    // Si exportas 'app', podés verificarla
    // expect(server.app).toBeDefined();
  });
});
