import { getAuth } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";

type Variables = {
  userId: string;
};
export const shouldBeUser = createMiddleware<{ Variables: Variables }>(
  async (c, next) => {
    const { userId } = getAuth(c);
    if (!userId) {
      return c.json(
        {
          message: "You are not logged in.",
        },
        401,
      );
    }

    c.set("userId", userId);
    await next();
  },
);

export const shouldBeAdmin = createMiddleware<{ Variables: Variables }>(
  async (c, next) => {
    const auth = getAuth(c);
    if (!auth.userId) {
      return c.json(
        {
          message: "You are not logged in.",
        },
        401,
      );
    }

    const claims: CustomJwtSessionClaims = auth.sessionClaims;
    if (claims.role !== "admin") {
      return c.json({ message: "You are not authorized." }, 403);
    }

    await next();
  },
);
