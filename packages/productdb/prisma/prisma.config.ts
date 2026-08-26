import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

export default {
  schema: "./prisma/schema.prisma",
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
};
