import { defineConfig } from "tsup";

export default defineConfig({
  target: "esnext",
  format: ["cjs", "esm"],
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
  noExternal: [],
  skipNodeModulesBundle: true,
});
