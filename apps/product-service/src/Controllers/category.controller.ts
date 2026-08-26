import { Prisma, prisma } from "@repo/productdb";
import { Request, Response } from "express";

export const createCategory = async (req: Request, res: Response) => {
  const data: Prisma.CategoryCreateInput = req.body;

  const category = await prisma.category.create({ data });

  res.status(201).json(category);
};

export const getCatgories = async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany();
  res.status(200).json(categories);
};

export const updateCatgories = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: Prisma.CategoryUpdateInput = req.body;
  const updatedCategory = await prisma.category.update({
    where: { id: Number(id) },
    data,
  });

  res.status(201).json(updatedCategory);
};
export const deleteCatgorie = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.category.delete({ where: { id: Number(id) } });
  res.status(200).json({ message: "Category has been deleted" });
};
