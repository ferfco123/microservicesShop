import { z } from "zod";

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
