# Hiring and interaction improvements

The next iteration keeps the existing static routes, English/Spanish content, and light/dark palettes. No domain configuration or new professional claims are introduced.

## Hiring and reading

The mobile navigation exposes the localized CV, and the homepage hero links directly to the hiring overview. Role-specific evidence cards connect backend and full-stack interests to existing case studies. Leadership links to the documented career section; a detailed All-Win case study still requires publishable facts from the owner.

Each study presents organization, role, period, outcome, and evidence scope before its article. Markdown headings generate section links. The next-study recommendation stays in the same language and study category and follows editorial order. Repository adapters are selected in one composition root; these navigation decisions remain in a pure view model.

Language switching maps a selected article heading to its translated counterpart instead of retaining an invalid translated slug. Paired study translations must retain corresponding heading depth/order; incompatible structures fail the build. Shared anchors such as `#walkthrough` remain unchanged.

## Inquiry handling

With JavaScript enabled, the form uses a lifecycle-managed custom element, a pure feedback view model, and an HTTP transport port. Fields become read-only and the submit button is disabled during the request. The payload remains standard URL-encoded Netlify form data; field contents are never added to analytics.

HTTP errors, network errors, and requests exceeding 15 seconds produce an accessible unconfirmed-submission message. Input remains in the form, focus moves to the feedback, and a retry action becomes available. There is no automatic retry: a timed-out request might already have reached the provider. A successful HTTP response navigates to the existing localized confirmation page; it does not establish inbox delivery or lead qualification.

Disconnecting the element aborts its request and event listeners. Without JavaScript, the original native POST and browser validation remain available. Netlify Forms detection is still required. The existing analytics submission event continues to represent an attempt, not delivery.

## Theme preferences

The header provides the light/dark toggle. The initial appearance follows the OS until a visitor saves an explicit choice. That choice persists across pages and languages, with a session fallback when storage is blocked. Other tabs receive ordinary storage updates. No-JavaScript visitors continue to receive the CSS system theme. The footer has no appearance selector.

## Screenshot previews

The existing experimentation screenshot can be enlarged in a native modal dialog. The browser handles modal focus containment and Escape; closing restores focus to the trigger. Opening locks background scrolling, and closing or navigating away restores it. The source attribution remains an ordinary external link. Without JavaScript or dialog support, the screenshot and source remain usable and the unavailable trigger stays hidden.

Additional gateway screenshots or leadership content remain editorial follow-ups requiring real assets and disclosure-safe facts.

## Verification

```sh
# Build with the inquiry feature enabled, as in CI.
PUBLIC_CONTACT_FORM_ENABLED=true npm run validate
npx playwright install chromium webkit
npm run test:e2e

# Targeted WebKit coverage:
npm run test:e2e -- --project=webkit
```

The full suite continues on desktop Chromium and mobile Chromium. The separate WebKit mobile smoke suite covers the hiring/CV path, localization and theme navigation, header theme persistence, screenshot focus restoration, and failed inquiry recovery. Its report includes a mobile Spanish dark-mode screenshot for review; no unreviewed visual snapshot baseline is shipped.

Inquiry browser tests use intercepted requests and never send live inquiries. They explicitly skip when the form was disabled at build time. Live POST verification remains separately opt-in through the deployment-check workflow. `PLAYWRIGHT_CHANNEL=chrome` applies only to the Chromium projects, not WebKit.

The transition and deployment tests now share a route catalog. Generated-output validation also checks its expected route count and decodes Unicode fragment IDs when checking localized section links.
