import type { Product } from "@repo/productdb";
import { z } from "zod";
export type cartItemType = Partial<Product> & {
  id: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  img?: string;

  key?: string;
};

export type cartItemsType = cartItemType[];
export type zustandCartItemsType = Record<string, cartItemType>;

export const shippingAddressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(6, "Invalid phone")
    .max(10, "Invalid phone")
    .regex(/^\d+$/, "Phone number must contain only numbers"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
});

export type ShippingAddressForm = z.infer<typeof shippingAddressSchema>;

export type CartStoreStateType = {
  cart: cartItemsType;
  hasYdrateted: boolean;
};

export type CartStotreActionsType = {
  addToCart: (product: cartItemType) => void;
  removeFromCart: (product: cartItemType) => void;
  clearCart: () => void;
};
