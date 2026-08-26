import { clerkClient, getAuth } from "@clerk/express";

import { Request, Response, NextFunction } from "express";

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: string;
    };
  }
}
interface AuthenticatedRequest extends Request {
  userId?: string;
}
export const shouldBeUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({
      message: "Not logged in",
    });
  }
  req.userId = userId;
  next();
};

export const shouldBeAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const auth = getAuth(req);
  if (!auth.userId) {
    console.log("no token");
    return res.status(401).json({
      message: "Not logged in",
    });
  }

  const claims: CustomJwtSessionClaims = auth.sessionClaims;
  if (claims.metadata?.role !== "admin") {
    console.log("no admin", auth.sessionClaims.metadata?.role);
    return res.status(401).json({
      message: "You are not authtorized",
    });
  }
  next();
};
