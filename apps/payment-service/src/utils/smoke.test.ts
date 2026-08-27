import { describe, it, expect } from "vitest";
process.env.KAFKA_BROKER = "localhost:9092";
process.env.STRIPE_SECRET_KEY = "sk_test_mock";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_mock";
describe("Config Smoke Tests", () => {
  it("Debería cargar las instancias de configuración sin explotar", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_mock_12345";
    process.env.KAFKA_BROKER = "localhost:9092";

    const { producer } = await import("./kafka.js");
    const { default: stripe } = await import("./stripe.js");

    expect(producer).toBeDefined();
    expect(stripe).toBeDefined();
  });
});
