/**
 * Example of a custom Oxlint rule using the jsPlugins feature.
 * Oxlint's jsPlugins API is compatible with ESLint v9+ rules.
 */
// eslint-disable-next-line eslint-plugin-import/no-default-export
export default {
  meta: {
    name: "custom-rules",
  },
  rules: {
    "no-todo-identifier": {
      meta: {
        type: "suggestion",
        docs: {
          description: "disallow TODO as an identifier",
        },
      },
      create(context) {
        return {
          Identifier(node) {
            if (node.name === "TODO") {
              context.report({
                node,
                message: 'Do not use "TODO" as a variable or function name.',
              });
            }
          },
        };
      },
    },
    "no-relative-imports": {
      meta: {
        type: "problem",
        docs: {
          description: "disallow relative imports (starting with ./ or ../)",
        },
      },
      create(context) {
        const checkImport = (node) => {
          if (
            node.source &&
            (node.source.value.startsWith("./") || node.source.value.startsWith("../"))
          ) {
            context.report({
              node: node.source,
              message: "Relative imports are not allowed. Please use absolute paths or aliases.",
            });
          }
        };
        return {
          ImportDeclaration: checkImport,
          ExportNamedDeclaration: checkImport,
          ExportAllDeclaration: checkImport,
        };
      },
    },
    "named-export": {
      meta: {
        type: "problem",
        docs: {
          description: "enforce named exports",
        },
      },
      create(context) {
        return {
          ExportDefaultDeclaration(node) {
            context.report({
              node,
              message: "Default exports are not allowed. Please use named exports.",
            });
          },
        };
      },
    },
    "directory-structure": {
      meta: {
        type: "problem",
        docs: {
          description: "enforce directory structure and name case",
        },
      },
      create(context) {
        const filename = context.getFilename();
        const base = filename.replace(process.cwd(), "");
        // 1. Check if under client or server if in src
        if (
          base.includes("/src/") &&
          !base.startsWith("/client/src/") &&
          !base.startsWith("/server/src/")
        ) {
          context.report({
            loc: { line: 1, column: 0 },
            message: "Project files must be under client/src/ or server/src/.",
          });
        }
        // 2. Check name case (already covered by unicorn/filename-case, but I can add more here if needed)
        return {};
      },
    },
  },
};
