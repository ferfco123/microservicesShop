import { Request, Response } from "express";

import { prisma, Prisma } from "@repo/productdb";
import { producer } from "../utils/kafka.js";

import type { stripeProductType } from "@repo/types/product";

export const createProduct = async (req: Request, res: Response) => {
  const data: any = req.body;

  const { colors, images, category, price, ...rest } = data;

  if (!colors || !Array.isArray(colors) || colors.length === 0) {
    return res.status(400).json({ message: "Colors array is required" });
  }

  if (!images || typeof images !== "object") {
    return res.status(400).json({ message: "Images are required" });
  }

  const missingColors = colors.filter((color) => !(color in images));
  if (missingColors.length > 0) {
    return res
      .status(400)
      .json({ message: `Missing image for color :${missingColors}` });
  }
  try {
    const product = await prisma.product.create({
      data: {
        ...rest,
        colors,
        images,
        price: Math.round(Number(price)),
        categorySlug: category,
      },
    });

    const stripeProduct: stripeProductType = {
      id: product.id.toString(),
      name: product.name,
      price: product.price,
    };

    await producer.send("product.created", stripeProduct, stripeProduct.id);
    res.status(201).json(product);
  } catch (error) {
    console.dir(error, { depth: null });

    res.status(500).json({
      message: "Error creating product",
      error: error,
    });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  const { sort, category, search, limit } = req.query;
  const isCategoryFilterActive = category && category !== "all";
  const where: Prisma.ProductWhereInput = {
    ...(isCategoryFilterActive && {
      category: {
        slug: {
          equals: String(category),
          mode: "insensitive",
        },
      },
    }),
    ...(search && {
      name: {
        contains: String(search),
        mode: "insensitive",
      },
    }),
  };

  const orderBy = (() => {
    switch (sort) {
      case "lowToHigh":
        return { price: Prisma.SortOrder.asc };

      case "HighToLow":
        return { price: Prisma.SortOrder.desc };

      case "Oldest":
        return { createdAt: Prisma.SortOrder.asc };

      case "Newest":
        return { createdAt: Prisma.SortOrder.desc };

      default:
        return undefined;
    }
  })();

  const products = await prisma.product.findMany({
    where,
    orderBy,
    take: limit ? Number(limit) : undefined,
  });

  res.status(200).json(products);
};
export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("id", id);
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  res.status(200).json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: Prisma.ProductUpdateInput = req.body;

  try {
    const updateProduct = await prisma.product.update({
      where: { id: Number(id) },
      data,
    });

    res.status(200).json(updateProduct);
  } catch (error) {
    res.status(404).json({ message: "Product not found" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ message: "An array of product IDs is required" });
  }

  const numericIds = ids.map((id) => Number(id));

  try {
    const result = await prisma.product.deleteMany({
      where: {
        id: {
          in: numericIds,
        },
      },
    });

    await producer.send("product.deletedMany", {
      value: JSON.stringify({ ids: numericIds, count: result.count }),
    });

    return res.status(200).json({
      message: `${result.count} product(s) deleted successfully`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Error deleting products:", error);
    return res.status(500).json({ message: "Failed to delete products" });
  }
};
