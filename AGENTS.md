# Agent Guidelines

- **No Browser UI Checks**: Do not perform browser UI checks or automated browser verification unless explicitly asked. Verify code with TypeScript (`pnpm exec tsc --noEmit`) and ESLint (`pnpm lint`).
- **Use & Customize shadcn**: Always prioritize using shadcn/ui components in `@/components/ui/`. Feel free to edit and adapt shadcn components directly to fit the application's design system.
