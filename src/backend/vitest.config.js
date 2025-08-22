import { defineConfig } from "vitest/config";

export default defineConfig ({
    test : {
        isolate: false,
        include : ['tests/**/*.test.js'],
        globals : true,
        environment : "node"
    }
});
