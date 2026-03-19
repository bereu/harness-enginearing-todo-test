import { defineConfig } from "oxlint";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import customRules from "./plugins/custom-rules.js";
import oxlintRules from "./.oxlintrc.json";

// eslint-disable-next-line eslint-plugin-import/no-default-export
export default defineConfig({
  ...oxlintRules,
  rules: {
    ...oxlintRules.rules,
    "no-relative-import-paths/no-relative-import-paths": "error",
    "custom-rules/named-export": "error",
    "custom-rules/directory-structure": "error",
  },
  jsPlugins: [noRelativeImportPaths, customRules],
  overrides: [
    {
      files: ["server/src/**/*.ts"],
      settings: {},
    },
    {
      files: ["client/src/**/*.tsx", "client/src/**/*.ts"],
      plugins: ["react"],
      settings: {},
    },
    {
      files: ["server/test/**/*.ts"],
      rules: {
        "typescript/unbound-method": "off",
      },
    },
  ],
});
