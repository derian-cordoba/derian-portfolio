# Derian Córdoba · Portfolio

A static, content-first portfolio built with Astro, TypeScript, and Tailwind CSS. Includes a homepage, two professional case studies, three open-source project pages, a downloadable CV, and an accessible gateway simulation.

## Run locally

Use Node.js 24.16+, 26.3+, or 22.23.4+. The engine range covers Astro and the lint toolchain.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4321`. Build with `npm run build`; deploy the generated `dist/` directory to a static host. `npm run preview` serves the production output locally.

## Architecture

This project uses an MVVM-inspired presentation layer without adding a reactive application framework. Pure view models prepare page data; Astro components render it. The gateway demo has a small DOM controller that binds a pure state model to the view.

```text
src/
  domain/                 Framework-independent contracts
  application/ports/      Content repository interface
  infrastructure/         Astro content adapter and composition root
  presentation/
    view-models/          Pure page and interaction data transformations
    controllers/          Progressive DOM bindings
  content/                Typed profile data and Markdown case studies
  components/             Small UI, section, visual, and layout components
  layouts/                Shared document and case-study layouts
  pages/                  Static route composition and metadata endpoints
```

See [architecture decisions](docs/architecture.md) for dependency rules and tradeoffs.

## Edit content

- Update identity, contact details, and career history in `src/content/profile.ts`.
- Add or edit case studies in `src/content/studies/`. The collection schema validates metadata during the build.
- Use `kind: experience` for `/work/{id}/` or `kind: project` for `/projects/{id}/`.
- Replace `public/Derian-Cordoba-CV-2026.pdf` when updating the CV.
- Change `SITE_URL` when moving to a custom domain, then rebuild. It controls canonical URLs and the sitemap.
- Change design tokens in `src/styles/global.css`; reusable UI components live in `src/components/ui/`.

Professional summaries are grounded in the supplied CV. Open-source descriptions are grounded in repository documentation. Diagrams and the gateway interaction are illustrative, not production telemetry.

## Quality checks

```sh
npm run validate        # Type checks, lint, formatting, unit tests, production build
npm run test:e2e        # Production browser tests; run after building
```

Browser tests require Chromium: `npx playwright install chromium`. They cover desktop/mobile navigation, internal links, the CV URL, automated accessibility checks, no-JavaScript content, and failure/recovery interaction. Configure `PLAYWRIGHT_CHANNEL=chrome` to use an installed Google Chrome instead.

ESLint requires braces for all control-flow statements, strict equality, and `const` where possible. TypeScript uses Astro's strictest preset. Prettier formats Astro and orders Tailwind utilities.

## Verification in this environment

The type, lint, formatting, unit, build, and generated-output checks can run locally. Browser QA and Sites source synchronization encountered sandbox network restrictions during creation; no deployed version or browser accessibility result is claimed. Run the included browser suite in an environment that permits local preview connections.

## Hosting and privacy

The project has no runtime server, database, contact form, third-party analytics, or live GitHub API dependency. Fonts are served locally. Contact actions use email and professional profile links. The CV is a downloadable public asset on any publicly deployed copy.

The tracked `.openai/hosting.json` identifies the private Sites deployment. Public access and a custom domain are separate hosting choices. Static assets can also be deployed to another provider without changing the application architecture.
