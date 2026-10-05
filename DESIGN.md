Foundation
Preset `b4GmhKTlYG` uses shadcn's `radix-luma` style, zinc surfaces, rose primary,
Inter body text, and Lora headings. `components.json` records the registry style;
`app/globals.css` owns theme, radius, typography, and layout tokens.

Keep the current page regions, responsive grids, sidebar widths, carousel order,
and overlay placement. Adjust internal spacing through shared components.

Component ownership

- Use `components/ui` for buttons, badges, inputs, selects, tabs, cards, menus,
  dialogs, sheets, sliders, and skeletons. Change their defaults here.
- Consumers may position components with `className`; appearance belongs in
  variants. Do not override their padding, gap, color, typography, radius, or
  control height. Add a meaningful reusable variant when an existing one cannot
  express the requirement.
- `Button`: default 40px, small 32px, large 48px; matching icon sizes, plus 24px
  compact icons. `inline` is for text links. `media` and `media-ghost` maintain
  contrast on imagery. Keep selected states in `variant` and accessible state props.
- `Input`: 40px, with `leadingIcon` / `trailingIcon` reserving space for adornments.
- `Badge`: default for metadata, `filter` for removable filters; `soft` is the
  subtle primary treatment. Interactive multi-select filters use buttons.
- `Card`: 24px padding/gap, or 16px with `size="sm"`; `interactive` adds hover.
- `DialogContent`: standard padded modal, or `surface="cinema"` for video.
- `SheetContent`: `detail`, `fullscreen`, and `search` preserve their established
  geometry. Fullscreen sheets and line tabs intentionally have square outer edges.
- `MediaCard`, `SectionHeader`, `ContentCarousel`, `DetailBottomSheet`, and filter
  helpers own repeated application compositions. Reuse them across movies and TV.
  Shared media compositions live in `features/media`; generic application
  compositions remain in `components/common`. `MediaListingLayout` owns discovery
  and category geometry through named variants and composition slots.
- `FilterSelect` owns Luma option grouping; `FilterSearchSelect` uses the shared
  Command/Popover composition for searchable filters. `PersonnelGrid` uses
  `MediaCard` for cast and crew; `MediaCard`'s `image` variant supports photo-only
  galleries.
- Sheets use the registry's default animation classes and Radix close/presence
  behavior. Keep controlled sheet roots mounted when closed so exit animations
  can finish; disable queries with `enabled` instead of changing their cache keys.
  Do not override sheet animations in global CSS.
- `Image` in `components/ui/image.tsx` owns native responsive image delivery and
  shared media effects. Use its variants and accurate `sizes`; do not reintroduce
  Next image optimization or consumer appearance overrides.
- Native buttons remain appropriate for image thumbnails, provider tiles, and
  rating stars whose geometry comes from their content.

Rhythm and typography
Use Tailwind's spacing scale: 1–2 for icon/label gaps, 3–4 for compact groups,
4–6 for card content, 6–8 for panels, and 8–12 for page sections. Keep responsive
page gutters on `container` / `gutter`. Avoid arbitrary values or new fractional
steps for one-off adjustments.

Use `heading-hero`, `heading-page`, `heading-section`, and `heading-card` for
headings, and `label-section` for uppercase metadata labels. These inherit color
so headings on media can use the media foreground. Body text uses `text-sm` or
`text-base`; metadata uses `text-xs`. Do not reintroduce 9–11px text.

Use the preset radius scale: `rounded-4xl` for panels/cards/dialogs,
`rounded-3xl` for media cards and controls, `rounded-xl` / `rounded-2xl` for
nested surfaces, and pill/circle controls from the shared primitives.

Tokens and strict checks
Use semantic colors (`primary`, `muted`, `destructive`, `success`, `info`,
`highlight`, `rating`) rather than palette colors. Media uses `media`,
`media-foreground`, `media-muted`, and `scrim` independently of light/dark mode.
Named sheet, sidebar, and media-size tokens preserve the existing layout.

`@shadcn/lint` 0.2.0 does not export a named strict preset. `eslint.config.mjs`
implements the strict policy with all six rules at error severity:
`no-restyle`, `no-raw-colors`, `no-arbitrary-values`, `no-inline-styles`,
`no-unknown-classes`, and `require-static-classes`.

Only `components/ui/**` disables restyling, arbitrary-value, and static-class
checks, as documented by the linter: primitives define appearance and Radix
structural expressions. Color, unknown-class, and inline-style checks still apply.
Dynamic parallax offsets use a CSS custom property, not an inline transform.

Run `pnpm exec tsc --noEmit` and `pnpm lint` after changes. Do not perform browser
UI verification unless explicitly requested.
