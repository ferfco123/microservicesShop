import { stripeProductType } from "@repo/types/product.js";
import stripe from "./stripe.js";

export const createStripeProduct = async (product: stripeProductType) => {
  console.log("=== PRODUCTO RECIBIDO DE KAFKA ===", product);
  console.log(
    "VALOR DE PRICE:",
    product?.price,
    "TIPO:",
    typeof product?.price,
  );
  try {
    const newProduct = {
      name: product.name,
      metadata: {
        dbProductId: product.id.toString(),
      },
      default_price_data: {
        currency: "usd",
        unit_amount: Math.round(Number(product.price) * 100),
      },
    };
    const addproduct = await stripe.products.create(newProduct, {
      idempotencyKey: product.id,
    });
    return addproduct;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getStripProductPrice = async (productId: string | number) => {
  try {
    const stripeProductId = productId.toString();

    const products = await stripe.products.search({
      query: `metadata['dbProductId']:'${stripeProductId}'`,
    });

    if (products.data.length === 0) {
      throw new Error(`Product not found: ${productId}`);
    }
    const stripeProduct = products.data[0];

    const prices = await stripe.prices.list({
      product: stripeProduct?.id,
      active: true,
      limit: 1,
    });

    if (prices.data.length === 0) {
      throw new Error(`Price not found for product: ${productId}`);
    }

    return prices.data[0]?.unit_amount;
  } catch (error) {
    console.error("Error searching price:", error);
    throw error;
  }
};

export const deleteStripeProduct = async (productId: string) => {
  try {
    const res = await stripe.products.del(productId.toString());
    return res;
  } catch (error) {
    console.error("Error deleting price:", error);
    throw error;
  }
};
