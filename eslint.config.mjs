import nextPlugin from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tailwind from "eslint-plugin-tailwindcss";
import { plugin as shadcn } from "@shadcn/lint";

const clientDirectiveRule = {
  selector:
    "ExpressionStatement[expression.value='use client']:not([directive='use client'])",
  message: 'Place "use client" at the start of the module, before imports.',
};

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
      "@typescript-eslint": tsPlugin,
      shadcn,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "no-restricted-syntax": ["error", clientDirectiveRule],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/**", "**/app/**"],
              message:
                "Import domain code from features and infrastructure from lib, never from route files.",
            },
          ],
        },
      ],
      "tailwindcss/no-custom-classname": "off",
      "shadcn/no-restyle": [
        "error",
        {
          allow: ["layout"],
          contracts: [
            {
              pattern:
                "^(Button|Input|SelectTrigger|Badge|TabsList|TabsTrigger)$",
              deny: ["h-*", "min-h-*", "max-h-*", "size-*"],
            },
          ],
        },
      ],
      "shadcn/no-raw-colors": "error",
      "shadcn/no-arbitrary-values": "error",
      "shadcn/no-inline-styles": "error",
      "shadcn/no-unknown-classes": "error",
      "shadcn/require-static-classes": "error",
    },
    settings: {
      shadcn: {
        note: "See DESIGN.md. Use shared variants for appearance and theme tokens for values.",
      },
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
  {
    files: [
      "features/**/*.{ts,tsx}",
      "components/{common,layout,providers}/**/*.{ts,tsx}",
      "hooks/**/*.{ts,tsx}",
      "lib/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        clientDirectiveRule,
        {
          selector: "ExportAllDeclaration",
          message: "Use direct module imports instead of broad export barrels.",
        },
        {
          selector: "ExportDefaultDeclaration",
          message:
            "Application modules use named exports. Default exports belong to Next.js special files and shadcn primitives.",
        },
      ],
    },
  },
  {
    files: ["lib/**/*.{ts,tsx}", "hooks/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "@/features/**",
            "**/features/**",
            "@/app/**",
            "**/app/**",
          ],
        },
      ],
    },
  },
  {
    files: ["features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "@/app/**",
            "**/app/**",
            "@/components/layout/**",
            "**/components/layout/**",
          ],
        },
      ],
    },
  },
];
