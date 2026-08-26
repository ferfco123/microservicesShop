import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { clerkClient } from "../index.js";
import { producer } from "src/utils/kafka.js";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const limit = Number(req.query.limit) || 50;
  const offset = Number(req.query.offset) || 0;
  const search = req.query.search ? String(req.query.search).trim() : undefined;
  try {
    const response = await clerkClient.users.getUserList({
      limit,
      offset,
      query: search || undefined,
    });

    const usersList = Array.isArray(response) ? response : response.data;
    const totalCount =
      !Array.isArray(response) && response.totalCount
        ? response.totalCount
        : usersList.length;
    const simplifiedUsers = usersList.map((user: any) => {
      const primaryEmail =
        user.emailAddresses?.find(
          (e: any) => e.id === user.primaryEmailAddressId,
        )?.emailAddress ||
        user.emailAddresses?.[0]?.emailAddress ||
        "No email";
      const name = [user.firstName, user.lastName].filter(Boolean).join(" ");

      return {
        id: user.id,
        fullName: name || "Sin nombre",
        email: primaryEmail,
        avatar: user.imageUrl,
        role: user.publicMetadata?.role || "user",
      };
    });

    res.status(200).json({
      data: simplifiedUsers,
      totalCount,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }
  const user = await clerkClient.users.getUser(id as string);

  res.status(200).json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ error: "Ids are required" });
  }
  await Promise.all(ids.map((id) => clerkClient.users.deleteUser(id)));

  res.status(201).json({
    message: `${ids.length} users deleted`,
  });
};

export const createUser = async (req: Request, res: Response) => {
  const { emailAddress, firstName, lastName, password, username } = req.body;
  console.log("body", req.body);
  if (!emailAddress || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const emailStr = Array.isArray(emailAddress) ? emailAddress[0] : emailAddress;

  if (!emailStr || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const newUser = await clerkClient.users.createUser({
      emailAddress: [emailStr],
      password,
      firstName,
      lastName,
      username,
      skipPasswordChecks: false,
    });

    await producer.send("user.created", {
      username: newUser.username,
      email: newUser.emailAddresses[0]?.emailAddress,
    });
    res.status(201).json(newUser);
  } catch (error: any) {
    console.log("=== ERROR DE CLERK REAL ===");
    console.dir(error, { depth: null });
    console.log("===========================");

    return res.status(400).json({
      message:
        error?.errors?.[0]?.longMessage ||
        error?.message ||
        "Error al crear usuario",
      errors: error?.errors || [],
    });
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { firstName, lastName, username, role } = req.body;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const updatedUser = await clerkClient.users.updateUser(id, {
      ...(firstName !== undefined && { firstName }),
      ...(lastName !== undefined && { lastName }),
      ...(username !== undefined && { username }),

      ...(role !== undefined && {
        publicMetadata: {
          role,
        },
      }),
    });

    // const primaryEmail =
    //   updatedUser.emailAddresses?.find(
    //     (e) => e.id === updatedUser.primaryEmailAddressId,
    //   )?.emailAddress || updatedUser.emailAddresses?.[0]?.emailAddress;

    // await producer.send("user.updated", {
    //   id: updatedUser.id,
    //   firstName: updatedUser.firstName,
    //   lastName: updatedUser.lastName,
    //   username: updatedUser.username,
    //   email: primaryEmail,
    //   role: updatedUser.publicMetadata?.role,
    // });

    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
