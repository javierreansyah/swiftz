Rules
- Follow `DESIGN.md` and `docs/ARCHITECTURE.md`.
- Reuse existing patterns/components before creating new ones.
- Keep shadcn lint rules enabled as errors. Do not disable rules to make code pass.

Structure
- `app/` — routes, metadata, server fetching, Suspense.
- `features/` — domain code.
- `lib/` and `hooks/` — shared code.
- Keep route composition in `app/` and domain logic in `features/`.

Data & Routes
- Resolve route params on the server and pass plain IDs to client screens.
- Reuse existing query options and query keys.
- Preserve existing ISR, cache isolation, visibility gating, browser fetching, and History API behavior.

UI
- Use and customize existing `@/components/ui/` components.
- Use shared variants and semantic tokens from the design system.

Validation
- Run `pnpm format`.
- Run `pnpm exec tsc --noEmit` and `pnpm lint`.
- Run focused tests when applicable.
- Run the production build for architectural changes.
- Do not perform browser checks unless explicitly requested.
