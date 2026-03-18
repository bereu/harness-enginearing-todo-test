/**
 * Example of a custom Oxlint rule using the jsPlugins feature.
 * Oxlint's jsPlugins API is compatible with ESLint v9+ rules.
 */
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
  },
};
