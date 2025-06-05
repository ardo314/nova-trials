import { defineConfig } from "tsup";

export default defineConfig({
  target: "node16",
  format: ["cjs"],
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: false,
  minify: true,
});
