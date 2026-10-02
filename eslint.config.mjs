import nextPlugin from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";
import tailwind from "eslint-plugin-tailwindcss";
import { plugin as shadcn } from "@shadcn/lint";

export default [
  {
    ignores: [".next/**", "node_modules/**", "dist/**", "out/**", ".git/**"],
  },
  {
    ...tailwind.configs.recommended,
    settings: {
      tailwindcss: {
        cssConfigPath: "./app/globals.css",
        callees: ["cn", "cva", "clsx"],
      },
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      shadcn,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "tailwindcss/no-custom-classname": "off",
      "shadcn/no-restyle": ["error", {
        allow: ["layout"],
        contracts: [
          { pattern: "^(Button|Input|SelectTrigger|Badge|TabsList|TabsTrigger)$", deny: ["h-*", "min-h-*", "max-h-*", "size-*"] },
        ],
      }],
      "shadcn/no-raw-colors": "error",
      "shadcn/no-arbitrary-values": "error",
      "shadcn/no-inline-styles": "error",
      "shadcn/no-unknown-classes": "error",
      "shadcn/require-static-classes": "error",
    },
    settings: {
      shadcn: { note: "See DESIGN.md. Use shared variants for appearance and theme tokens for values." },
      tailwindcss: {
        cssConfigPath: "./app/globals.css",
        callees: ["cn", "cva", "clsx"],
      },
    },
  },
  {
    files: ["components/ui/**"],
    // Primitives own their styling and Radix's structural CSS expressions.
    rules: {
      "shadcn/no-restyle": "off",
      "shadcn/no-arbitrary-values": "off",
      "shadcn/require-static-classes": "off",
    },
  },
];
