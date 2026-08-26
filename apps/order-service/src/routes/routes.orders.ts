import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply,
  RouteGenericInterface,
} from "fastify";
import { shouldBeAdmin, shouldBeUser } from "../Middleweare/AuthMiddleweare.js";

import type { OrderChartType } from "@repo/types";
import { Order, type OrderSchemaType } from "@repo/orderdb";
import { startOfMonth, subMonths } from "date-fns";

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
  }
}
interface SearchQuery {
  limit: string;
  search?: string;
}
interface DeleteOrdersBody {
  ids: string[];
}
interface SearchRoute extends RouteGenericInterface {
  Querystring: SearchQuery;
  Body: DeleteOrdersBody;
}
interface GetOrdersQuery {
  Querystring: {
    page?: string;
  };
}
export default async function orderRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
) {
  fastify.get<GetOrdersQuery>(
    "/",
    { preHandler: shouldBeUser },
    async (
      request: FastifyRequest<{ Querystring: { page?: string } }>,
      reply: FastifyReply,
    ) => {
      try {
        const page = Math.max(1, parseInt(request.query.page || "1", 10));
        const limit = 10;
        const skip = (page - 1) * limit;

        const filter = { userId: request.userId };

        const [orders, totalOrders] = await Promise.all([
          Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
          Order.countDocuments(filter),
        ]);
        console.log("orders", orders);
        const totalPages = Math.ceil(totalOrders / limit);

        return reply.code(200).send({
          orders,
          pagination: {
            totalOrders,
            totalPages,
            currentPage: page,
            limit,
          },
        });
      } catch (error) {
        return reply.code(500).send({ error: "Error getting orders" });
      }
    },
  );
  fastify.get(
    "/allOrders",
    { preHandler: shouldBeAdmin },
    async (request: FastifyRequest<SearchRoute>, reply: FastifyReply) => {
      const { limit, search } = request.query;
      const filter: Record<string, any> = {};
      if (search && search.trim() !== "") {
        filter.email = { $regex: search.trim(), $options: "i" };
      }
      try {
        let query = Order.find(filter).sort({ createdAt: -1 });
        if (limit && !isNaN(Number(limit))) {
          query = query.limit(Number(limit));
        }

        const totalOrders = await Order.countDocuments(filter);
        const orders = await query;

        return reply.code(200).send({
          orders,
          totalOrders,
        });
      } catch (error) {
        return reply.code(500).send({ error: "Error getting orders" });
      }
    },
  );
  fastify.get(
    "/order-chart",

    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const now = new Date();
        const sixMonthsAgo = startOfMonth(subMonths(now, 5));

        const row = await Order.aggregate([
          { $match: { createdAt: { $gte: sixMonthsAgo, $lte: now } } },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              total: { $sum: 1 },
              successfull: {
                $sum: { $cond: [{ $eq: ["$status", "successfull"] }, 1, 0] },
              },
            },
          },
          {
            $project: {
              _id: 0,
              total: 1,
              successfull: 1,
              year: "$_id.year",
              month: "$_id.month",
            },
          },
          { $sort: { year: 1, month: 1 } },
        ]);
        const monthNames: string[] = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const result: OrderChartType[] = [];
        for (let i = 5; i >= 0; i--) {
          const d = subMonths(now, i);
          const year = d.getFullYear();
          const month = d.getMonth() + 1;

          const match = row.find(
            (item) => item.year === year && item.month === month,
          );
          result.push({
            month: String(monthNames[month - 1]),
            total: match ? match.total : 0,
            successful: match ? match.successfull : 0,
          });
        }
        return reply.send(result);
      } catch (error) {
        console.error(error);
        return reply.code(500).send({ error: "Error getting orders" });
      }
    },
  );
  fastify.delete(
    "/",
    { preHandler: shouldBeAdmin },
    async (request: FastifyRequest<SearchRoute>, reply: FastifyReply) => {
      const { ids } = request.body || {};

      if (!Array.isArray(ids) || ids.length === 0) {
        return reply
          .code(400)
          .send({ error: "An array of order IDs is required" });
      }

      try {
        const result = await Order.deleteMany({
          _id: { $in: ids },
        });

        return reply.code(200).send({
          message: `${result.deletedCount} order(s) deleted successfully`,
          deletedCount: result.deletedCount,
        });
      } catch (error) {
        console.error(error);
        return reply.code(500).send({ error: "Error deleting orders" });
      }
    },
  );
}
