import type { Product, Category } from "@repo/productdb";
import z from "zod";

export type ProductType = Product;
export type productsType = ProductType[];

export type CategoryType = Category;

export type stripeProductType = {
  id: string;
  name: string;
  price: number;
};

export const CategoryFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
});

export const category = [
  "T-shirts",
  "Shoes",
  "Accessories",
  "Bags",
  "Dresses",
  "Jackets",
  "Gloves",
] as const;

export const colors = [
  "gray",
  "green",
  "blue",
  "red",
  "black",
  "white",
  "yellow",
] as const;

export const sizes = [
  "xs",
  "s",
  "m",
  "l",
  "xl",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
] as const;
export type SizeType = (typeof sizes)[number];
export type ColorType = (typeof colors)[number];
export const AddProductSchema = z
  .object({
    name: z.string().min(1, { message: "Product name is required." }),

    shortDescription: z
      .string()
      .min(1, { message: "Short description is required" })
      .max(20, {
        message: "Short description has to be less than 20 characters",
      }),

    description: z
      .string()
      .min(1, { message: "Description is required" })
      .max(60, {
        message: "Description has to be less than 60 characters",
      }),

    price: z.number().min(1, { message: "Price is required" }),
    category: z.string().min(1, { message: "Category is required" }),

    colors: z
      .array(z.enum(colors))
      .min(1, { message: "At least one color is required" }),

    sizes: z
      .array(z.enum(sizes))
      .min(1, { message: "At least one size is required" }),

    // Acepta cualquier clave con string, undefined o "" sin romper la validación inicial
    images: z.record(z.string(), z.string().optional().or(z.literal(""))),
  })
  .refine(
    (data) => {
      if (!data.colors || data.colors.length === 0) return true;

      // Valida ÚNICAMENTE los colores que están seleccionados en el array `data.colors`
      const missingImages = data.colors.filter((selectedColor) => {
        const imageUrl = data.images?.[selectedColor];
        return !imageUrl || imageUrl.trim() === "";
      });

      return missingImages.length === 0;
    },
    {
      message: "An image is required for each selected color",
      path: ["images"],
    },
  );

export type AddProductFormValues = z.infer<typeof AddProductSchema>;
