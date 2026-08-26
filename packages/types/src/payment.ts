import { z } from "zod";

export const PaymentFormSchema = z.object({
  cardHolder: z.string().min(1, "Name is required"),
  cardNumber: z
    .number()
    .min(16, "Card number is required")
    .max(16, "Card number is required"),
  expirationDate: z
    .string()
    .min(6, "Invalid phone")
    .max(10, "Invalid phone")
    .regex(
      /^(0[1-9]|1[0-2])\/\d{2}/,
      "Expiration date must be in MM/YY format",
    ),
  cvv: z.string().min(3, "cvv is required").max(3, "cvv is required"),
});

export type PaymentFormInputs = z.infer<typeof PaymentFormSchema>;
