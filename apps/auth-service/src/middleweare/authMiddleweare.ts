import { getAuth } from "@clerk/express";

import { Request, Response, NextFunction } from "express";
interface AuthenticatedRequest extends Request {
  userId?: string;
}
export const shouldBeUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  //   if (!auth) {
  //     console.log("userId no hay ", auth);

  //     return res.status(401).json({
  //       message: "Not logged in",
  //     });
  //   }

  //   req.userId = userId;
  next();
};
