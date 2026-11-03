# Architecture decisions

## Static generation

All portfolio routes are rendered at build time. The content has no per-user state or request-time freshness requirement. This gives visitors complete HTML without requiring client JavaScript and keeps infrastructure proportional to the problem.

## MVVM where it helps

The model consists of framework-independent `Study`, `Profile`, and `Experience` contracts. View-model factories prepare navigation, reading time, labels, sorted groups, and illustrative gateway state. Astro components are views. The gateway custom element only handles lifecycle, events, and DOM bindings.

MVVM does not require two-way binding. A reactive store, observable base class, or dependency-injection framework would add machinery without serving this site's requirements.

## Dependency direction

```text
Astro pages ──→ view-model factories ──→ domain contracts
     │                   │
     │              repository port
     │                   ↑
composition root ──→ Astro content adapter
```

Domain types and the repository port do not import Astro. The infrastructure adapter maps validated collection entries into domain values. Only page composition and infrastructure know how content is loaded. Markdown rendering remains Astro-specific at the route boundary.

## SOLID applications

- **Single responsibility:** content loading, presentation mapping, interaction binding, and rendering have separate modules.
- **Open/closed:** additional case studies are content entries, not additional route implementations. Shared cards consume the same view model.
- **Liskov substitution:** the repository adapter and in-memory test implementation both satisfy the same small contract.
- **Interface segregation:** the content port exposes only the operation currently needed. There is no generic CRUD abstraction.
- **Dependency inversion:** the homepage view-model factory accepts the repository interface; the composition root chooses Astro's implementation.

Visual variants use a bounded registry. Each diagram is a separate component; the registry selects it without making a large conditional template.

## Progressive enhancement

Navigation, career disclosures, content, and contact links use native HTML. The mobile menu only needs JavaScript to close automatically or respond to Escape. The gateway simulation hides its control until its custom element connects. Its initial state and explanatory text remain available without JavaScript.

## Evidence and scope

Professional content distinguishes reported outcomes from implementation details that were not supplied. The performance result stays limited to key processing flows. Public project pages link to their repositories and describe known boundaries. The gateway simulation is deliberately labeled and does not represent a live service.

## Validation boundaries

Collection schemas validate content at build time. Unit tests exercise grouping, immutable ordering, route mapping, and failure/recovery presentation. Browser checks exercise the compiled site, keyboard-accessible controls, responsive overflow, links, and automated accessibility rules. Automated accessibility checks complement visual review; they do not establish full WCAG conformance.

## Dependency compatibility

The package overrides update transitive `minimatch` and `esbuild` versions to address published advisories. Production builds and lint checks exercise their consumers. Remove the overrides when the upstream dependency ranges include patched releases.

## Localization

Locale is an explicit content attribute with a framework-independent `Locale` union. Study IDs remain stable across translations; content IDs distinguish the Markdown entries. The repository loads both languages, and the homepage view-model factory filters by locale before sorting and mapping cards. Routes render the correct collection entry through its content ID.

Typed dictionaries cover UI and interaction messages. The gateway controller reads its element's language and keeps that locale when transitioning between states. Routing helpers centralize locale prefixes, canonical page identity, and localized CV paths. Templates never duplicate a page solely to translate its layout.

English keeps its existing URLs. Spanish uses `/es/`; canonical, reciprocal alternate, x-default, and sitemap entries describe the relationship. Native language links work without JavaScript. A small enhancement preserves the query and fragment on switching, without requiring cookies or browser-language redirects.

## Theme preferences

The theme model resolves an explicit preference before the system preference. A pure view model supplies the next state, toggle state, and localized action label. A browser adapter handles optional local storage; the custom element binds clicks, system changes, and cross-tab storage events with lifecycle cleanup.

A minimal synchronous head script applies the stored choice before body rendering. Its generated JavaScript is tested directly so the first-paint path stays consistent with the application preference rules. Semantic CSS color pairs provide the light and dark palettes through `color-scheme`, including a no-JavaScript system fallback. Fixed dark diagrams keep light text, while previously fixed pastel diagrams have theme-aware colors.

## Notes and guided evidence

Notes use a framework-independent domain model and a small repository port. Astro adapters load validated collections; pure view models filter by locale, order entries, compute reading time, and create routes. Route composition selects the adapter. Dedicated page and card components share layouts and heading primitives. The application layer does not import Astro or browser APIs.

Gateway walkthrough data is separate from localized explanation and DOM rendering. Published JSON examples and tests are pinned to one repository revision. Native grouped disclosures make the traces usable without client JavaScript. The existing circuit-state simulation remains explicitly illustrative. Optional study media has typed dimensions, alt text, a caption, and a source link.

## Contact and measurement boundaries

A lifecycle-managed custom element handles email copying and feedback. Netlify inquiry forms are statically generated only when enabled; native POST delegates delivery and spam handling to the hosting provider. Successful browser submission is not treated as proof of inbox delivery.

Engagement names and metadata are bounded domain contracts. A browser adapter queues the optional Plausible transport, handles privacy preferences, and sanitizes URLs. A delegated controller attaches once across Astro transitions, while pageviews follow the router lifecycle. No form field values enter the measurement path. Tracking remains disabled until an account-specific script URL is configured.
