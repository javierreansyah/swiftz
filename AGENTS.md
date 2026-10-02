# Agent Guidelines

- **No Browser UI Checks**: Do not perform browser UI checks or automated browser verification unless explicitly asked. Verify code with TypeScript (`pnpm exec tsc --noEmit`) and ESLint (`pnpm lint`).
- **Use & Customize shadcn**: Use shadcn/ui components in @/components/ui/ only when needed. Edit and adapt existing components directly to match the design system rather than introducing unnecessary new primitives.
- **Design System**: Follow `DESIGN.md`. Keep all six shadcn lint rules enabled as errors. Use shared variants and semantic tokens; do not add consumer appearance overrides or disable rules to make new styling pass.
- **Architecture**: Follow `docs/ARCHITECTURE.md`. Keep route composition in `app`, domain code in `features`, and shared infrastructure in `lib` and root `hooks`. Use direct imports and named application exports.
- **Route Boundaries**: Server pages own metadata, server fetching, and route-level Suspense. Resolve dynamic route parameters on the server and pass plain IDs into named client screens.
- **Data Contracts**: Reuse feature query options and centralized query keys. Preserve ISR durations, direct browser fetching, account cache isolation, visibility gating, and same-page History API navigation.
- **Formatting & Validation**: Use `pnpm format` for formatting and `pnpm format:check` for verification. Run the required TypeScript and ESLint checks, focused tests, and a production build for architectural changes. Browser verification still requires an explicit request.
