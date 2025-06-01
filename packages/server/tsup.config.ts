import { defineConfig } from "tsup";

export default defineConfig({
  target: "node18",
  format: ["cjs"],
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: false,
  minify: true,
  noExternal: ["@nova-trials/shared"],
});
