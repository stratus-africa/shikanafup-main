import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "node:path";

const shimDir = path.resolve(__dirname, "src/lib/next-shims");

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      alias: [
        { find: /^next\/link$/, replacement: path.join(shimDir, "link.tsx") },
        { find: /^next\/image$/, replacement: path.join(shimDir, "image.tsx") },
        { find: /^next\/navigation$/, replacement: path.join(shimDir, "navigation.tsx") },
        { find: /^next\/font\/google$/, replacement: path.join(shimDir, "font-google.tsx") },
        { find: /^next\/headers$/, replacement: path.join(shimDir, "headers.tsx") },
        { find: /^next\/dynamic$/, replacement: path.join(shimDir, "dynamic.tsx") },
      ],
    },
  },
});
