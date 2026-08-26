"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var adapter_pg_1 = require("@prisma/adapter-pg");
exports.default = {
    schema: "./prisma/schema.prisma",
    adapter: new adapter_pg_1.PrismaPg({
        connectionString: process.env.DATABASE_URL,
    }),
};
