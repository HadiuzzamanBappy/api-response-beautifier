import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const isContent = mode === "content";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      // Clean only on the first build pass
      emptyOutDir: isContent,
      rollupOptions: {
        input: (isContent
          ? { content: resolve(__dirname, "src/index.tsx") }
          : {
            popup: resolve(__dirname, "popup.html"),
            background: resolve(__dirname, "src/background/index.ts")
          }) as Record<string, string>,
        output: {
          // Content script MUST be 'iife' to avoid SyntaxErrors in Chrome
          format: (isContent ? "iife" : "esm") as "iife" | "esm",
          entryFileNames: "[name].js",
          chunkFileNames: "[name].js",
          assetFileNames: "[name].[ext]",
          inlineDynamicImports: isContent,
        },
      },
    },
  };
});
