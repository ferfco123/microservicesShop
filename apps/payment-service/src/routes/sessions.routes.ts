import { Hono } from "hono";
import Stripe from "stripe";
import { shouldBeUser } from "../Middleweare/AuthMiddleweare.js";
import { type cartItemsType } from "@repo/types";

import stripe from "../utils/stripe.js";
import { getStripProductPrice } from "../utils/stripeProducts.js";
import { cartItemType } from "@repo/types/cart.js";

const sessionRoute = new Hono();

sessionRoute.post("/create-checkout-session", shouldBeUser, async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const cart = body.cart || body.items;

    if (!Array.isArray(cart) || cart.length === 0) {
      return c.json(
        { error: "El carrito está vacío o el formato es inválido." },
        400,
      );
    }

    const userId = c.get("userId");

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of cart) {
      if (!item.id) {
        throw new Error("Un elemento del carrito no contiene 'id'.");
      }

      const rawPrice = await getStripProductPrice(item.id);
      const numericPrice = Number(rawPrice);

      if (isNaN(numericPrice) || numericPrice <= 0) {
        throw new Error(
          `El precio recuperado para el producto ID ${item.id} no es válido (${rawPrice}).`,
        );
      }

      const unitAmount = Math.round(numericPrice);

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name || `Producto ${item.id}`,
            metadata: {
              size: item.selectedSize || item.size || "",
              color: item.selectedColor || item.color || "",
              category: item.category || "",
            },
          },
          unit_amount: unitAmount,
        },
        quantity: Number(item.quantity) || 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      client_reference_id: userId,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "ES", "MX", "AR"],
      },
      ui_mode: "embedded",
      return_url: `${process.env.CLIENT_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return c.json({ checkoutSessionClientsecret: session.client_secret });
  } catch (error: any) {
    console.error("CRITICAL ERROR en create-checkout-session:", error);
    return c.json(
      { error: error.message || "Error interno al crear la sesión de Stripe" },
      500,
    );
  }
});
sessionRoute.get("/:sessionId", async (c) => {
  try {
    const sessionId = c.req.param("sessionId");

    // Expandimos los datos del pago y las líneas del pedido
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "line_items"],
    });
    const totalInCents = session.amount_total ?? 0;
    const amountTotal = Number(totalInCents) / 100;
    const items =
      session.line_items?.data.map((item) => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        amount: Number(item.amount_total ?? 0) / 100,
      })) || [];
    return c.json({
      status: session.status,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      amountTotal,
      currency: session.currency?.toUpperCase(),
      items,
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default sessionRoute;
