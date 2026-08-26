import { Hono } from "hono";
import { producer } from "../utils/kafka.js";
import stripe from "../utils/stripe.js";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const webHooksRoutes = new Hono();

webHooksRoutes.post("/stripe", async (c) => {
  const endpointSecret = "whsec_...";
  const body: any = await c.req.text();
  const sig = c.req.header("stripe-signature");

  if (!sig || !webhookSecret) {
    console.error("Missing Stripe sign o WEBHOOK_SECRET");
    return c.json({ message: "Missing configuration or sign" }, 400);
  }
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error: any) {
    console.log("Webhook verification failed", error.message);
    return c.json(
      { message: `Webhook verification failed ${error.message}` },
      400,
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const shippingDetails = (session as any).shipping_details;
      const addressObj =
        shippingDetails?.address || session.customer_details?.address;

      const formattedAddress = addressObj
        ? [
            addressObj.line1,
            addressObj.line2,
            addressObj.city,
            addressObj.state,
            addressObj.postal_code,
            addressObj.country,
          ]
            .filter(Boolean)
            .join(", ")
        : "No shipping address";

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
        {
          expand: ["data.price.product"],
        },
      );
      const products = lineItems.data.map((item) => {
        const productData = item.price?.product as Stripe.Product;
        const metadata = productData?.metadata || {};

        return {
          name: item.description,
          quantity: item.quantity,
          price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
          size: metadata.size || null,
          color: metadata.color || null,
          category: metadata.category || null,
        };
      });
      const orderPayload = {
        stripeSessionId: session.id,

        userId: session.client_reference_id || null,
        email: session.customer_details?.email,
        ammount: session.amount_total ? session.amount_total / 100 : 0,
        status: session.payment_status === "paid" ? "pending" : "pending",
        shippingAddress: formattedAddress,
        products,
      };
      console.log("1. WEBHOOK RECIBIDO Y PAYLOAD ARMADO:", session.id);
      // 4. PUBLICAR EN KAFKA CON AWAIT
      try {
        await producer.send("payment.successful", orderPayload);
        console.log("Evento enviado a Kafka exitosamente:", session.id);
      } catch (kafkaError) {
        console.error("Error al publicar evento en Kafka:", kafkaError);
        return c.json({ message: "Error al procesar mensaje en la cola" }, 500);
      }
      break;
    }
    default:
      console.log(`Evento no manejado: ${event.type}`);
      break;
  }
  return c.json({ received: true });
});

export default webHooksRoutes;
