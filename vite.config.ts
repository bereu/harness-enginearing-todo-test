import { defineConfig } from "vite-plus";
import oxlintPlugin from "vite-plugin-oxlint";

export default defineConfig({
  plugins: [
    oxlintPlugin({
      configFile: "oxlint.config.js",
    }),
  ],
  lint: {
    ignorePatterns: ["dist/**", "node_modules/**"],
    rules: { "no-console": "warn" },
    options: { typeAware: true },
  },
});
