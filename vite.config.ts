import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { defineConfig } from "vite-plus";
import oxlintPlugin from "vite-plugin-oxlint";

const __dirname = dirname(fileURLToPath(import.meta.url));
const oxlintRules = JSON.parse(readFileSync(resolve(__dirname, ".oxlintrc.json"), "utf-8"));

export default defineConfig({
  plugins: [
    oxlintPlugin({
      configFile: "oxlint.config.js",
    }),
  ],
  lint: {
    ...oxlintRules,
    options: { typeAware: true },
  },
});
