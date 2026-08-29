# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Primora — a single-page marketing site (Portuguese, pt-BR) for a digital agency serving insurance brokers. React 19 + Vite + TypeScript + Tailwind CSS v4 + framer-motion. No backend, no router, no test runner.

## Commands

```bash
npm install
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build (type-checks first)
npm run lint      # eslint .
npm run preview
```

There are no tests. Verification is `build` + `lint` + manual checks (see below).

## Architecture

`src/main.tsx` → `src/App.tsx` → `src/pages/Home.tsx`. `Home.tsx` composes every section in scroll order; navigation is same-page anchors only.

Two layers under `src/components/`:

- **`src/components/ui/`** — primitives with no copy in them. `Section`, `SectionHeader`, `Button`, `IconFrame`, `Reveal`/`RevealGroup`/`RevealItem`, `Counter`, `BrandIcons`.
- **`src/components/`** — one file per page section, each consuming those primitives.

`src/lib/motion.ts` holds the animation variants, easing and viewport config. `src/content/site.ts` holds all disputed content (contact details, metrics, testimonials, plan prices).

### Rules that matter here

**Styling is Tailwind v4, CSS-first.** All tokens live in the `@theme` block of `src/index.css`. There is no `tailwind.config.js` and none should be added — v4 with `@tailwindcss/postcss` does not auto-load one, so a config file would be silently dead and become a second source of truth.

**Colour comes from one blue ramp.** `--color-brand-50` → `--color-brand-950`, plus semantic tokens (`ink-strong/body/muted/brand`, `on-dark*`, `surface*`, `line*`). The namespace is `brand-*` rather than `blue-*` on purpose: overriding `blue-*` would silently repaint legacy `text-blue-100` usages, whereas any surviving `blue-*`/`gray-*` class is legacy that greps cleanly. `--color-danger-*` is the only non-blue, and only for error states.

Do not introduce: gradients on buttons or text, `filter: blur()` backdrops, `rounded-3xl`/`shadow-2xl`, `transition-all`, or decorative colour palettes per card. These were removed deliberately — they were what made the site read as AI-generated.

**Animation.** `<MotionConfig reducedMotion="user">` in `App.tsx` handles `prefers-reduced-motion` globally, so sections never repeat that condition. Use `<Reveal>`/`<RevealGroup>` rather than hand-writing `initial`/`whileInView`. `Counter` is the exception that reads `useReducedMotion()` directly, because it must jump to the final value rather than animate slower.

**Spacing and anchors** are owned by `<Section>`: it sets the vertical rhythm and the `scroll-mt` that compensates the fixed navbar. Don't set `py-*` on a section directly.

**Icons.** Always go through `<IconFrame>`, which scales `strokeWidth` with size — lucide's stroke does not scale, so a large icon with default stroke looks thin and weak. lucide-react v1 has no brand icons; Instagram/LinkedIn live in `ui/BrandIcons.tsx` as inline SVG.

**The logo files are dark navy.** Over any dark surface they need `brightness-0 invert`, otherwise they disappear.

### Content policy

`src/content/site.ts` is the single source for contact info, metrics, testimonials and prices. **A `null` field or empty array means the data is not confirmed, and the consuming block must not render.** Never substitute a plausible-looking placeholder — fabricated testimonials, a `(11) 99999-9999` phone and an invented "+24%" metric all shipped that way before. A rating claim additionally needs a `source` URL; without one it is misleading advertising, not just a design issue.

Legal pages are static HTML in `public/` (`privacidade.html`, `termos.html`), since adding a router for two text pages is disproportionate. Both still contain `[A DEFINIR]` fields and need a lawyer's review.

## Manual verification

```bash
# these should return nothing
grep -rnE "(text|bg|border)-(gray|pink|indigo|cyan|emerald|slate|yellow)-[0-9]" src/
grep -rn 'blur-\[\|transition-all\|rounded-3xl\|href="#"' src/
```

Then: Tab from top to bottom (focus always visible, FAQ opens, `Esc` closes the mobile menu, clicking a label focuses its input); widths 320/768/1024/1440 with no horizontal scroll; DevTools → Rendering → emulate `prefers-reduced-motion: reduce` and confirm the hero mesh stops, counters show final values, and the FAQ still opens.
