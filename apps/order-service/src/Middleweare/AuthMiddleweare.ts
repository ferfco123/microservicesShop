import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";

type AuthenticatedFastifyRequest = FastifyRequest & {
  userId?: string;
  role?: string;
};

export const shouldBeUser = async (
  request: AuthenticatedFastifyRequest,
  reply: FastifyReply,
) => {
  const { userId } = getAuth(request);

  if (!userId) {
    reply.status(401).send({ error: "User not authenticated" });
    return;
  }
  request.userId = userId;
};

export const shouldBeAdmin = async (
  request: AuthenticatedFastifyRequest,
  reply: FastifyReply,
) => {
  const auth = getAuth(request);
  if (!auth.userId) {
    console.log("order");
    return reply.status(401).send({ error: "User not authenticated" });
  }

  const claims: CustomJwtSessionClaims = auth.sessionClaims;
  if (claims.metadata?.role !== "admin") {
    return reply.status(403).send({ error: "You are not authorized" });
  }
};
