# Agent Guidelines

- **No Browser UI Checks**: Do not perform browser UI checks or automated browser verification unless explicitly asked. Verify code with TypeScript (`pnpm exec tsc --noEmit`) and ESLint (`pnpm lint`).
- **Use & Customize shadcn**: Use shadcn/ui components in @/components/ui/ only when needed. Edit and adapt existing components directly to match the design system rather than introducing unnecessary new primitives.
- **Design System**: Follow `DESIGN.md`. Keep all six shadcn lint rules enabled as errors. Use shared variants and semantic tokens; do not add consumer appearance overrides or disable rules to make new styling pass.
