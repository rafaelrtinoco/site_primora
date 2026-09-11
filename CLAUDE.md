# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Praxis Digital — a single-page marketing site (Portuguese, pt-BR) for a digital agency. React 19 + Vite + TypeScript + Tailwind CSS v4 + framer-motion. No backend, no router, no test runner.

The audience is five segments of consultative-sale businesses: insurance brokers, real-estate agencies, accounting firms, law firms and administrative-services companies. **Four of the five have their own advertising rules** — that is content, not trivia, and it lives in `site.setores`.

Services sold: content/social media, sites and landing pages, digital art, and **paid traffic management**. The agency previously sold insurance back-office support ("assessoria operacional"); that service was discontinued and its section replaced by `Trafego.tsx`. Do not reintroduce it.

## Commands

```bash
npm install
npm run dev         # Vite dev server
npm run build       # tsc -b && check:copy && vite build (type-checks first)
npm run check:copy  # scripts/check-copy.mjs: no em dash / banned jargon in visible text
npm run gen:glyphs  # regenerates src/lib/brandGlyphs.ts from simple-icons (see below)
npm run lint        # eslint .
npm run preview
```

There are no tests. Verification is `build` + `lint` + manual checks (see below).

## Architecture

`src/main.tsx` → `src/App.tsx` → `src/pages/Home.tsx`. `Home.tsx` composes every section in scroll order; navigation is same-page anchors only.

The order is Hero → Solutions → Trafego → Ia → Ferramentas → Process → Plans → Testimonials → Faq → CTA. **Filenames are English, the copy and some anchor ids are not**: `Solutions.tsx` is the "Serviços" section (`id="solutions"`), one of the two `tone="light"` exceptions. `Testimonials` and `Ferramentas` render nothing while their lists in `site.ts` are empty, so a section vanishing from the page is usually content, not a bug. The old FreeAudit section was merged into `CTA` (same message, and its only button scrolled to CTA anyway) and should not come back.

Two layers under `src/components/`:

- **`src/components/ui/`** — primitives with no copy in them. `Section`, `SectionHeader`, `Button`, `IconFrame`, `Reveal`/`RevealGroup`/`RevealItem`, `Counter`, `WhatsAppIcon`.
- **`src/components/`** — one file per page section, each consuming those primitives.

`src/lib/motion.ts` holds the animation variants, easing and viewport config. `src/content/site.ts` holds all disputed content (contact details, sectors, metrics, testimonials, plan and traffic prices).

### No backend, no router

**The contact form is a `wa.me` deep link, not a submission.** `CTA.tsx`'s `handleSubmit` builds the message text with `montarMensagem` and calls `window.open` *synchronously inside the click handler* — no `await` may sit before that call, or the browser blocks the popup. The resulting URL is also kept in state, so a blocked popup degrades to a manual "open WhatsApp" button instead of a dead end. A honeypot field (`_honey`) sits off-screen via absolute positioning rather than `display:none`, since some bots special-case the latter. No data leaves the visitor's browser until they press send inside WhatsApp itself — the Política de Privacidade is written on that premise, so it isn't just a UX choice.

**Cross-section communication is namespaced window `CustomEvent`s**, because there's no router and no shared store. Two `src/lib/` modules exist purely as event contracts:

- `planoSelecionado.ts` — `PLANO_EVENT` (`praxis:plano-selecionado`), dispatched from Plans and Trafego when a plan/traffic tier is clicked, consumed by CTA to pre-fill the form's plan `<select>`.
- `consent.ts` — `ABRIR_PREFERENCIAS_EVENT`, dispatched from the footer's "cookie preferences" link, consumed by `CookieConsent` to reopen its panel.

The event is always an enhancement, never a dependency: the CTA `<select>` stays a fully usable manual control if the event never fires. Keep new cross-component signals on this pattern, with the same `praxis:` prefix.

**Overlay z-index ladder** — collisions here are invisible until two overlays actually stack, so keep new fixed/sticky elements off these values: navbar (`z-50`) → WhatsApp FAB (`z-[85]`) → cookie banner (`z-[90]`) → cookie preferences dialog (`z-[95]`) → skip-to-content link (`z-[100]`).

### Rules that matter here

**Styling is Tailwind v4, CSS-first.** All tokens live in the `@theme` block of `src/index.css`. There is no `tailwind.config.js` and none should be added — v4 with `@tailwindcss/postcss` does not auto-load one, so a config file would be silently dead and become a second source of truth.

**The palette is five brand colours plus four derived tones.** `#ffffff`, `#171915`, `#2e3823`, `#070905`, `#DBEB17`, exposed as `carbon-950/900/800`, `moss-700/600` and `acid-400/500/800`, with semantic tokens on top (`ink-strong/body/muted/accent`, `on-dark*`, `surface*`, `line*`). The namespaces deliberately avoid Tailwind's own `lime-*`/`stone-*`: overriding a native namespace would silently repaint legacy classes, whereas any surviving `brand-*`/`blue-*`/`gray-*` is legacy that greps cleanly. `--color-danger-*` is the only colour outside the palette, and it's functional (error states), never decorative.

**The single most important colour rule: `#DBEB17` is 1.32:1 on white.** On light sections it is never text, never a thin icon, never a border — it appears only as a *fill* with `carbon-950` on top (15.15:1). The textual accent on light is `ink-accent` (#5a6b00, 5.94:1) or `moss-700` (12.31:1). On the dark surfaces the lime is 15.15:1 / 13.86:1 / 9.33:1 and is the accent everywhere.

**WhatsApp action buttons use the theme's lime, not WhatsApp's brand green.** `CTA.tsx`'s `BOTAO_WHATSAPP` constant and the FAB in `WhatsAppFab.tsx` were originally hardcoded to `#25D366`/`#1DA851`, a sixth colour outside the palette; both now use `bg-acid-400 text-carbon-950 hover:bg-acid-500`, the same combination as the primary `Button` variant (15.15:1 contrast). This was a deliberate choice to keep every action button inside the five-colour palette, even though it drops the widely-recognized WhatsApp-green affordance — don't reintroduce `#25D366` to "restore brand accuracy" without checking with the project owner first.

**Brand logos are the one deliberate exception to the five-colour palette, and it's scoped to a single section.** `Ferramentas.tsx` extrudes the real logo of each day-to-day tool (Instagram, Facebook, Meta Ads, Google Ads, Canva, CapCut, WhatsApp) onto a 3D tile, in that brand's own official hex — including `#25D366` for the WhatsApp glyph there, which is fine precisely because it's identifying a tool, not a call-to-action button. This is treated like `--color-danger-*`: a colour outside the palette, admitted only because it's functional. The containment rule: brand colour shows up **only in the logo glyph itself** (`src/lib/brandGlyphs.ts`, generated, see below). Tile face, bevel, rim light, chip background, section background, every other pixel stays `carbon-*`/`moss-*`/`acid-*`. Don't extend this exception elsewhere without checking with the project owner.

**The page is dark-dominant.** `Section` defaults to `tone="dark"`; Serviços and FAQ are the declared light exceptions. `Section` has five tones total — `light`, `muted`, `dark`, `darkAlt`, `moss` — used for subtle variation between consecutive dark sections (Process, Testimonials and Trafego use `darkAlt`; Ia uses `moss`). `<html>` and `<body>` carry the dark background so iOS overscroll doesn't flash white.

**Radius and elevation are also bespoke tokens**, for the same reason as the colour namespaces: redefining `--radius-lg` would silently repaint legacy `rounded-lg` without showing in a diff. `--radius-control` (pill, for buttons/badges), `--radius-frame` (14px, icon frames and inputs), `--radius-card` (18px) and `--radius-panel` (24px) are the only radii to use. Elevation is `--shadow-e1/e2/e3`, and **nothing goes above e3** — that ceiling is what makes `shadow-2xl` a rule violation rather than a taste call. `.card` (light) and `.card-dark` (dark) in `@layer components` are the standard card surfaces; on dark, separation comes from border + a slightly lighter background rather than shadow, because shadow doesn't read against `carbon-950`.

**The logo files are full-colour** (lime wordmark + gradient "P"). The old Primora logo was flat navy and needed `brightness-0 invert` over dark surfaces; **applying that filter to these files flattens the gradient into a white blob.** Pick the file that suits the surface instead: `praxis-horizontal-lime.png` on dark, `praxis-horizontal-escuro.png` on light.

**Two files in `public/` are derivatives, not brand masters.** `praxis-favicon.png` (96px) is the tab icon, and `praxis-simbolo-720.webp` is the decorative symbol behind the hero headline. Both come from `praxis-simbolo.png`, the 1080px master, which weighs 567 kB and was previously served raw for both jobs: it is the largest asset in the project and neither use needs a pixel of that resolution. Regenerate the derivatives from the master if the mark ever changes, and don't point markup back at the master.

Do not introduce: gradients on buttons or text, `filter: blur()` backdrops, `rounded-3xl`/`shadow-2xl`, `transition-all`, or decorative colour palettes per card. These were removed deliberately — they were what made the site read as AI-generated.

**Icons.** Always go through `<IconFrame>`, which scales the Phosphor size with the frame. `@phosphor-icons/react` at `weight="duotone"`; the duotone layer is what gives the icon mass instead of a thin 1.5px stroke.

### Animation

`<MotionConfig reducedMotion="user">` in `App.tsx` handles `prefers-reduced-motion` globally **for framer-motion only**. Use `<Reveal>`/`<RevealGroup>` rather than hand-writing `initial`/`whileInView`.

**Four animations are declared in CSS and are therefore outside MotionConfig's reach**: `.hero-mesh`, `.hero-symbol` (the brand mark rotating behind the headline), `.marquee-track` (the sector ticker) and `scroll-behavior`. Each carries its own `@media (prefers-reduced-motion: no-preference)` in `index.css`. Any new CSS animation must do the same — `grep -o "prefers-reduced-motion" dist/assets/*.css | wc -l` should match the number of CSS animations (4 today). Use `grep -o | wc -l`, not `grep -c`: the built CSS is minified onto a single line, so `grep -c` counts that one line and prints `1` no matter how many queries survived.

`Counter` is the other exception: it reads `useReducedMotion()` directly, because it must jump to the final value rather than animate slower.

The Ferramentas 3D scene is a further exception: its `requestAnimationFrame` loop is plain JS driven by Three.js, not framer-motion, so `MotionConfig` doesn't touch it either. See "The Ferramentas 3D scene" below for how it's paused instead.

**Spacing and anchors** are owned by `<Section>`: it sets the vertical rhythm and the `scroll-mt` that compensates the fixed navbar. Don't set `py-*` on a section directly.

### The Ferramentas 3D scene

`Ferramentas.tsx` (between `Ia` and `Process`) is the one section with a WebGL canvas: the seven tools the agency operates day to day, as logos extruded onto tiles that orbit slowly, built with vanilla Three.js rather than react-three-fiber, one dependency instead of three, and direct control of the render loop, which is exactly what has to stop under reduced motion, offscreen, and with the tab hidden.

**`three` must never land in the main bundle.** `src/components/ferramentas/CenaFerramentas.tsx` is the only file that imports `three`, and `Ferramentas.tsx` reaches it only through `React.lazy(() => import(...))`, gated on `useInView`, `!useReducedMotion()` and a WebGL feature check. After touching anything here, confirm with `npm run build && grep -c WebGLRenderer dist/assets/index-*.js`, which must print `0`. The symbol should only exist in the separate `CenaFerramentas-*.js` chunk.

**`src/lib/brandGlyphs.ts` is generated, not hand-written.** `npm run gen:glyphs` (`scripts/gen-brand-glyphs.mjs`) pulls each brand's official SVG path and hex from the `simple-icons` devDependency (CC0-1.0 licensed), and falls back to a Phosphor `weight="fill"` glyph, coloured with the theme's `acid-400` instead of a brand hex, for tools absent from that package (Canva and CapCut today). Re-run the script after bumping either `simple-icons` or `@phosphor-icons/react`; it throws rather than silently emitting a blank tile if a slug it expects has disappeared. Never hand-edit the generated file.

**Dispose is not optional.** React 19's StrictMode double-mounts every component in dev. Without the explicit `renderer.dispose()` / `forceContextLoss()` / geometry-and-material disposal that `construirCena.ts` runs in the `dispose()` it returns, that mounts two WebGL contexts and leaks the first one.

### Content policy

`src/content/site.ts` is the single source for contact info, sectors, metrics, testimonials and prices. **A `null` field or empty array means the data is not confirmed, and the consuming block must not render.** Never substitute a plausible-looking placeholder — fabricated testimonials, a `(11) 99999-9999` phone and an invented "+24%" metric all shipped that way before. A rating claim additionally needs a `source` URL; without one it is misleading advertising, not just a design issue.

Currently `null`/empty on purpose: `contato.email` (the site is WhatsApp-only), `contato.telefone`, `redes.*`, `metricas`, `depoimentos`.

Two claims must stay precisely worded:

- **Paid traffic.** The management fee and the media budget are separate, and the site says so. The media budget is paid by the client directly to Google/Meta, on their own account. `trafego.verbaMinima` is stated as a recommendation, not a requirement.
- **AI.** The agency uses AI *in its own process* — research, first drafts, reading numbers — with a person approving what ships. The WhatsApp chatbot bundled with the plans is a **fixed-response flow, not an AI agent**, and `Ia.tsx` says that explicitly. Copy must never blur the two.

Legal pages are static HTML in `public/` (`privacidade.html`, `termos.html`), since adding a router for two text pages is disproportionate. Both still contain `[A DEFINIR]` fields and need a lawyer's review.

**Voice.** Copy is pt-BR, second person (`você`), short sentences, no em dash in anything a visitor reads (JSX text, `alt`, `aria-label`, `meta description`). Code comments are exempt — they aren't visible text. `scripts/check-copy.mjs` (`npm run check:copy`, wired into `build`) enforces the em-dash rule plus a banned-jargon list ("solução completa", "excelência", "parceiro estratégico"...) across `src/**/*.{ts,tsx}` and `index.html`, skipping comment lines. Two subagents in `.claude/agents/` carry the fuller ruleset: `copywriter-conversao` for rewriting copy, `landing-page-cro` for section-level conversion structure (promessa → prova → oferta → objeção → ação). Both know the two non-negotiable claims below and the empty-proof-social rule, so invoking them doesn't require repeating this file.

`README.md` documents nothing about this site: it is the README of the B2 Tech Claude Code Starter Pack, which rides along in this repository. See "Tooling that isn't the site's".

### Consent (LGPD)

`src/lib/consent.ts` is a gate built ahead of what it gates: the site currently loads **zero** analytics and zero pixels, and `CookieConsent.tsx` says so to the user. The rule from the module's own header still applies to any future addition: **no script in an optional category (`analise`, `marketing`) may load before `getConsent(categoria)` returns `true` for it.** Adding GA or the Meta Pixel is therefore never a `<script>` tag dropped into `index.html` — it's a consent-conditional load gated on `getConsent`.

`VERSAO_CONSENTIMENTO` must be bumped whenever the tracked categories change; bumping it invalidates every stored choice, which is correct — a consent given under an old category set (or, as happened at the Primora→Praxis rebrand, under a different data controller) doesn't carry forward. `lerConsentimento` treats a blocked/unavailable `localStorage` as "hasn't decided yet" rather than throwing, so the banner simply reappears next visit instead of breaking the page. The preferences panel is a real modal — focus trap, `Esc` to close, focus restored to the opener on close.

## Tooling that isn't the site's

The repository carries a second, unrelated artifact: the **B2 Tech Claude Code Starter Pack**, a generic agent setup for Python/Flask + Next.js/GCP projects. `README.md`, `claude-lendo.png`, `.claude-plugin/plugin.json` (`name: b2tech-starter`), `.claude/skills/` and `.claude/hooks/` all belong to it, not to this site. When mapping the site's architecture, those paths are noise.

`.claude/agents/` is the exception: `copywriter-conversao`, `landing-page-cro` and `auditoria-tecnica` were written for this project. The first two are described under Voice, above; `auditoria-tecnica` runs the security, performance and accessibility sweep, and it knows which generic checklist items don't apply to a backend-less SPA.

**Its skills assume another stack.** `code-review-b2` applies a Vertical Slice / DDD / Flask checklist, and `security-check` and `spec-driven-development` presume a backend that doesn't exist here. Invoking them on this codebase reviews it against the wrong criteria. The `threejs-*` skills are the ones with a plausible use, in Ferramentas.

**The hooks in `.claude/settings.json` do change the agent loop, so know what they do.** `post-edit-format.sh` runs on every `Write|Edit`: it calls `eslint --fix` on the edited file and **exits 2 when eslint fails**, which returns as an error to Claude. A hook error right after an edit is usually a lint rule, not a badly written file. It also calls `npx --no-install prettier`, but prettier is not a dependency here, so that branch silently no-ops: **there is no formatter in this repository** and style is held by convention. `pre-bash-guard.sh` blocks destructive Bash patterns (`rm -rf /`, `curl | sh`, `git push --force origin main`, `DROP TABLE`) before they run, and `pre-commit-secrets.sh` scans staged files on `git commit`/`git push`.

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

# WhatsApp numbers must come from site.contato.whatsapp, never inlined
grep -rn "wa.me/[0-9]" src/

# no analytics/pixel outside the consent gate in src/lib/consent.ts
grep -rniE "gtag|googletagmanager|fbq|analytics|pixel" src/ index.html
```

```bash
npm run check:copy   # zero em dash / banned jargon in visible text
```

Both `scripts/*.mjs` resolve the project root with `fileURLToPath`, never with `new URL(...).pathname`. This checkout lives under a path containing a space, and `.pathname` hands back the URL's `%20` undecoded, which made `check:copy` die with `ENOENT` on `src/` and took `build` down with it.

```bash
# three.js must stay out of the main chunk, only load when Ferramentas nears the viewport
npm run build && grep -c WebGLRenderer dist/assets/index-*.js   # must print 0
```

Then: logo legible in the navbar before *and* after scroll; Tab from top to bottom (the lime focus ring must be visible over dark *and* over white, FAQ opens, `Esc` closes the mobile menu, clicking a label focuses its input); widths 320/768/1024/1440 with no horizontal scroll (watch the marquee, which bleeds by design); DevTools → Rendering → emulate `prefers-reduced-motion: reduce` and confirm the hero mesh, the rotating symbol, the marquee **and the Ferramentas 3D scene** all stop (the scene should never even load its chunk under reduced motion, check Network), counters show final values, and the FAQ still opens.
