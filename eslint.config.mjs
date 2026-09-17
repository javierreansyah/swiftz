import nextPlugin from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";
import tailwind from "eslint-plugin-tailwindcss";

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
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "tailwindcss/no-custom-classname": "off",
    },
    settings: {
      tailwindcss: {
        cssConfigPath: "./app/globals.css",
        callees: ["cn", "cva", "clsx"],
      },
    },
  },
];
