import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/cli.ts",
    "src/days/index.ts",
    "src/days/types.ts",
    "src/days/day[0-9][0-9].ts",
    "src/lib/*.ts",
  ],
  format: ["esm"],
  target: "node20",
  platform: "node",
  sourcemap: true,
  clean: true,
  outDir: "dist",
  banner: {
    js: "#!/usr/bin/env node",
  },
  splitting: false,
  dts: false,
  minify: false,
  bundle: false, // Don't bundle - preserve file structure
});
