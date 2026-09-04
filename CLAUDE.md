# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Praxis Digital — a single-page marketing site (Portuguese, pt-BR) for a digital agency. React 19 + Vite + TypeScript + Tailwind CSS v4 + framer-motion. No backend, no router, no test runner.

The audience is five segments of consultative-sale businesses: insurance brokers, real-estate agencies, accounting firms, law firms and administrative-services companies. **Four of the five have their own advertising rules** — that is content, not trivia, and it lives in `site.setores`.

Services sold: content/social media, sites and landing pages, digital art, and **paid traffic management**. The agency previously sold insurance back-office support ("assessoria operacional"); that service was discontinued and its section replaced by `Trafego.tsx`. Do not reintroduce it.

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

- **`src/components/ui/`** — primitives with no copy in them. `Section`, `SectionHeader`, `Button`, `IconFrame`, `Reveal`/`RevealGroup`/`RevealItem`, `Counter`, `WhatsAppIcon`.
- **`src/components/`** — one file per page section, each consuming those primitives.

`src/lib/motion.ts` holds the animation variants, easing and viewport config. `src/content/site.ts` holds all disputed content (contact details, sectors, metrics, testimonials, plan and traffic prices).

### Rules that matter here

**Styling is Tailwind v4, CSS-first.** All tokens live in the `@theme` block of `src/index.css`. There is no `tailwind.config.js` and none should be added — v4 with `@tailwindcss/postcss` does not auto-load one, so a config file would be silently dead and become a second source of truth.

**The palette is five brand colours plus four derived tones.** `#ffffff`, `#171915`, `#2e3823`, `#070905`, `#DBEB17`, exposed as `carbon-950/900/800`, `moss-700/600` and `acid-400/500/800`, with semantic tokens on top (`ink-strong/body/muted/accent`, `on-dark*`, `surface*`, `line*`). The namespaces deliberately avoid Tailwind's own `lime-*`/`stone-*`: overriding a native namespace would silently repaint legacy classes, whereas any surviving `brand-*`/`blue-*`/`gray-*` is legacy that greps cleanly. `--color-danger-*` is the only colour outside the palette other than the WhatsApp green, and both are functional, never decorative.

**The single most important colour rule: `#DBEB17` is 1.32:1 on white.** On light sections it is never text, never a thin icon, never a border — it appears only as a *fill* with `carbon-950` on top (15.15:1). The textual accent on light is `ink-accent` (#5a6b00, 5.94:1) or `moss-700` (12.31:1). On the dark surfaces the lime is 15.15:1 / 13.86:1 / 9.33:1 and is the accent everywhere.

**The page is dark-dominant.** `Section` defaults to `tone="dark"`; Serviços and FAQ are the declared light exceptions. `<html>` and `<body>` carry the dark background so iOS overscroll doesn't flash white.

**The logo files are full-colour** (lime wordmark + gradient "P"). The old Primora logo was flat navy and needed `brightness-0 invert` over dark surfaces; **applying that filter to these files flattens the gradient into a white blob.** Pick the file that suits the surface instead: `praxis-horizontal-lime.png` on dark, `praxis-horizontal-escuro.png` on light.

Do not introduce: gradients on buttons or text, `filter: blur()` backdrops, `rounded-3xl`/`shadow-2xl`, `transition-all`, or decorative colour palettes per card. These were removed deliberately — they were what made the site read as AI-generated.

**Icons.** Always go through `<IconFrame>`, which scales the Phosphor size with the frame. `@phosphor-icons/react` at `weight="duotone"`; the duotone layer is what gives the icon mass instead of a thin 1.5px stroke.

### Animation

`<MotionConfig reducedMotion="user">` in `App.tsx` handles `prefers-reduced-motion` globally **for framer-motion only**. Use `<Reveal>`/`<RevealGroup>` rather than hand-writing `initial`/`whileInView`.

**Four animations are declared in CSS and are therefore outside MotionConfig's reach**: `.hero-mesh`, `.hero-symbol` (the brand mark rotating behind the headline), `.marquee-track` (the sector ticker) and `scroll-behavior`. Each carries its own `@media (prefers-reduced-motion: no-preference)` in `index.css`. Any new CSS animation must do the same — `grep -c "prefers-reduced-motion" dist/assets/*.css` should match the number of CSS animations.

`Counter` is the other exception: it reads `useReducedMotion()` directly, because it must jump to the final value rather than animate slower.

**Spacing and anchors** are owned by `<Section>`: it sets the vertical rhythm and the `scroll-mt` that compensates the fixed navbar. Don't set `py-*` on a section directly.

### Content policy

`src/content/site.ts` is the single source for contact info, sectors, metrics, testimonials and prices. **A `null` field or empty array means the data is not confirmed, and the consuming block must not render.** Never substitute a plausible-looking placeholder — fabricated testimonials, a `(11) 99999-9999` phone and an invented "+24%" metric all shipped that way before. A rating claim additionally needs a `source` URL; without one it is misleading advertising, not just a design issue.

Currently `null`/empty on purpose: `contato.email` (the site is WhatsApp-only), `contato.telefone`, `redes.*`, `metricas`, `depoimentos`.

Two claims must stay precisely worded:

- **Paid traffic.** The management fee and the media budget are separate, and the site says so. The media budget is paid by the client directly to Google/Meta, on their own account. `trafego.verbaMinima` is stated as a recommendation, not a requirement.
- **AI.** The agency uses AI *in its own process* — research, first drafts, reading numbers — with a person approving what ships. The WhatsApp chatbot bundled with the plans is a **fixed-response flow, not an AI agent**, and `Ia.tsx` says that explicitly. Copy must never blur the two.

Legal pages are static HTML in `public/` (`privacidade.html`, `termos.html`), since adding a router for two text pages is disproportionate. Both still contain `[A DEFINIR]` fields and need a lawyer's review.

## Manual verification

```bash
# these should return nothing but comments
grep -rniE "primora" src/ index.html
grep -rnE "(brand|blue|gray|slate|indigo|cyan|emerald)-[0-9]" src/
grep -rn "brightness-0 invert" src/
grep -rniE "assessor|apólice|sinistro|back-office" src/
grep -rnE 'blur-\[|transition-all|rounded-3xl|href="#"' src/

# every hit must sit on a dark surface — read them, don't just count
grep -rn "text-acid\|border-acid\|ring-acid" src/
```

Then: logo legible in the navbar before *and* after scroll; Tab from top to bottom (the lime focus ring must be visible over dark *and* over white, FAQ opens, `Esc` closes the mobile menu, clicking a label focuses its input); widths 320/768/1024/1440 with no horizontal scroll (watch the marquee, which bleeds by design); DevTools → Rendering → emulate `prefers-reduced-motion: reduce` and confirm the hero mesh **and the rotating symbol and the marquee** all stop, counters show final values, and the FAQ still opens.
