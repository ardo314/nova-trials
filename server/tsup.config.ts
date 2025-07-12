import { defineConfig } from "tsup";

export default defineConfig({
  target: "node18",
  format: ["cjs"],
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: false,
  noExternal: [],
  skipNodeModulesBundle: true,
});
