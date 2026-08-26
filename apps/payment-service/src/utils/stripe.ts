import Stripe from "stripe";

const stripe = new Stripe(
  (process.env.STRIPE_SECRET_KEY as string) || "sk_test_mock_key",
  {
    apiVersion: "2025-08-27.basil" as any,
  },
);

export default stripe;
