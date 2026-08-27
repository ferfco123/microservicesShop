import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * MOCK STRIPE
 */
vi.mock("../utils/stripe.js", () => {
  return {
    default: {
      products: {
        create: vi.fn(),
        search: vi.fn(),
        del: vi.fn(),
      },
      prices: {
        list: vi.fn(),
      },
    },
  };
});

describe("stripeProducts Utility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * =========================
   * CREATE PRODUCT
   * =========================
   */

  it("Debería crear un producto con metadata correctamente", async () => {
    const { createStripeProduct } = await import("./stripeProducts.js");
    const { default: stripeMock } = await import("./stripe.js");

    (stripeMock.products.create as any).mockResolvedValue({
      id: "stripe_prod_123",
    });

    const product = { id: 1, name: "Test Product", price: 10 };
    await createStripeProduct(product as any);

    expect(stripeMock.products.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Test Product",
        metadata: expect.objectContaining({
          dbProductId: "1",
        }),
        default_price_data: expect.objectContaining({
          currency: "usd",
          unit_amount: 1000,
        }),
      }),
      expect.objectContaining({
        idempotencyKey: 1,
      }),
    );
  });

  it("Debería lanzar error si Stripe falla al crear producto", async () => {
    const { createStripeProduct } = await import("./stripeProducts.js");
    const { default: stripeMock } = await import("./stripe.js");

    const mockError = new Error("Stripe Creation Error");

    (stripeMock.products.create as any).mockRejectedValue(mockError);

    await expect(
      createStripeProduct({ id: 1, name: "Fail" } as any),
    ).rejects.toThrow("Stripe Creation Error");
  });

  /**
   * =========================
   * GET PRICE FLOW (SEARCH + PRICES)
   * =========================
   */

  it("Debería retornar el precio usando metadata search + prices", async () => {
    const { getStripProductPrice } = await import("./stripeProducts.js");
    const { default: stripeMock } = await import("./stripe.js");

    // 1. mock search por metadata
    (stripeMock.products.search as any).mockResolvedValue({
      data: [{ id: "stripe_prod_123" }],
    });

    // 2. mock prices
    (stripeMock.prices.list as any).mockResolvedValue({
      data: [{ unit_amount: 5000 }],
    });

    const price = await getStripProductPrice("123");

    expect(price).toBe(5000);

    expect(stripeMock.products.search).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.stringContaining("123"),
      }),
    );

    expect(stripeMock.prices.list).toHaveBeenCalledWith(
      expect.objectContaining({
        product: "stripe_prod_123",
        active: true,
        limit: 1,
      }),
    );
  });

  it("Debería lanzar error si el producto no existe en Stripe", async () => {
    const { getStripProductPrice } = await import("./stripeProducts.js");
    const { default: stripeMock } = await import("./stripe.js");

    (stripeMock.products.search as any).mockResolvedValue({
      data: [],
    });

    await expect(getStripProductPrice("123")).rejects.toThrow(
      "Product not found: 123",
    );
  });

  it("Debería lanzar error si no hay precios disponibles", async () => {
    const { getStripProductPrice } = await import("./stripeProducts.js");
    const { default: stripeMock } = await import("./stripe.js");

    (stripeMock.products.search as any).mockResolvedValue({
      data: [{ id: "stripe_prod_123" }],
    });

    (stripeMock.prices.list as any).mockResolvedValue({
      data: [],
    });

    await expect(getStripProductPrice("123")).rejects.toThrow(
      "Price not found for product: 123",
    );
  });

  /**
   * =========================
   * DELETE PRODUCT
   * =========================
   */

  it("Debería eliminar un producto correctamente", async () => {
    const { deleteStripeProduct } = await import("./stripeProducts.js");
    const { default: stripeMock } = await import("./stripe.js");

    (stripeMock.products.del as any).mockResolvedValue({
      id: "stripe_prod_123",
      deleted: true,
    });

    const result = await deleteStripeProduct("stripe_prod_123");

    expect(result.deleted).toBe(true);
    expect(stripeMock.products.del).toHaveBeenCalledWith("stripe_prod_123");
  });

  it("Debería lanzar error si falla delete en Stripe", async () => {
    const { deleteStripeProduct } = await import("./stripeProducts.js");
    const { default: stripeMock } = await import("./stripe.js");

    const mockError = new Error("Stripe Delete Error");

    (stripeMock.products.del as any).mockRejectedValue(mockError);

    await expect(deleteStripeProduct("stripe_prod_123")).rejects.toThrow(
      "Stripe Delete Error",
    );
  });
});
