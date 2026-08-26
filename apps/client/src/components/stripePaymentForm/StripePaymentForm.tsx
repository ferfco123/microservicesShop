import { loadStripe } from "@stripe/stripe-js";
import "./stripePaymentForm.css";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import useCart from "../../Zustand/useCart";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const StripePaymentForm = () => {
  const { getToken } = useAuth();
  const { cart } = useCart();

  const fetchClientSecret = useCallback(async () => {
    const token = await getToken();
    const cartValues = Object.values(cart);
    const response = await fetch(
      `${import.meta.env.VITE_PAYMENT_FORM}/session/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: cartValues }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error del servidor: status ${response.status}`,
      );
    }
    const json = await response.json();
    const clientSecret = json.checkoutSessionClientsecret || json.clientSecret;

    if (!clientSecret) {
      throw new Error("No se recibió el clientSecret de la API.");
    }
    return clientSecret;
  }, [getToken, cart]);

  return (
    <div id="checkout" className="spf">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default StripePaymentForm;
