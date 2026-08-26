"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        globals: true,
        environment: "node",
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "clover"],
            include: ["src/**/*.ts"],
            exclude: ["node_modules/", "src/types/"],
        },
    },
});
