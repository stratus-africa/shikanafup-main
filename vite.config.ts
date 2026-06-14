import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "node:path";

const shim = path.resolve(__dirname, "src/lib/next-shims.tsx");

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      alias: [
        { find: /^next\/link$/, replacement: shim },
        { find: /^next\/image$/, replacement: shim },
        { find: /^next\/navigation$/, replacement: shim },
        { find: /^next\/font\/google$/, replacement: shim },
        { find: /^next\/headers$/, replacement: shim },
        { find: /^next\/dynamic$/, replacement: shim },
      ],
    },
  },
});
