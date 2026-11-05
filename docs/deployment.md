# Netlify production setup

The portfolio remains a static Astro site. `netlify.toml` sets the build, output directory, Node version, production canonical URL, and Spanish error fallback. There is no SPA catch-all rewrite.

## Domain

Connect this GitHub repository to Netlify and use `main` as the production branch. Add `derian-cordoba.me` and `www.derian-cordoba.me` in Netlify Domain management, with the apex as the primary domain. Keep Cloudflare Registrar's nameservers and use Netlify's displayed external DNS records in Cloudflare. Start with DNS-only records while Netlify provisions HTTPS.

The default `SITE_URL` is `https://derian-cordoba.me`. Override it for a different production domain and rebuild. Both language variants, canonical links, social URLs, and the sitemap use it.

The `www` redirect is configured. Once the actual Netlify hostname is known, add a domain-specific redirect **before** the Spanish error fallback:

```toml
[[redirects]]
  from = "https://YOUR-ACTUAL-SITE.netlify.app/*"
  to = "https://derian-cordoba.me/:splat"
  status = 301
  force = true
```

Replace the example hostname; it is deliberately not shipped as an active rule. Configure the custom domain and certificate before enabling this redirect.

## Contact form

Netlify production builds set `PUBLIC_CONTACT_FORM_ENABLED=true`. Local builds, branch deploys, and deploy previews keep the form disabled by default. Enable **Forms detection** in the Netlify project and redeploy; check that `portfolio-inquiry-en` and `portfolio-inquiry-es` are detected. Configure submission notifications to your preferred inbox, then submit a test message in each language and verify receipt. No inbox address or secret belongs in the browser configuration.

The forms retain native POST, localized confirmation pages, HTML validation, a honeypot, and `data-astro-reload`. JavaScript adds a sending state, a bounded URL-encoded request, and inline recovery without discarding input. Only a successful HTTP response opens the confirmation page. Without JavaScript, native submission still works. Email links remain available regardless of hosting. Confirmation URLs are noindex and excluded from the sitemap. Local Astro preview does not process submissions; it cannot verify delivery.

To review the enabled form locally:

```sh
PUBLIC_CONTACT_FORM_ENABLED=true npm run validate
npm run preview
```

Provider setup: [Netlify Forms documentation](https://docs.netlify.com/manage/forms/setup/).

## Optional engagement analytics

External tracking is **off** unless `PUBLIC_PLAUSIBLE_SCRIPT_URL` is configured. In Plausible, add the production domain and copy the site-specific script URL from its installation snippet (`https://plausible.io/js/pa-….js`). Set that URL as the Netlify production build variable and redeploy. The URL is a public configuration value, not an API token.

The adapter disables automatic pageview capture and sends one pageview on each `astro:page-load`, including client navigation. It queues calls while the provider script loads, strips query strings and fragments, and skips hosts outside the configured measurement hostname (`PUBLIC_ANALYTICS_HOSTNAME`, falling back to `SITE_URL`). It also respects Do Not Track and Global Privacy Control. No contact field values, visitor identifiers, or outbound destination URLs are included in custom event properties. Plausible still processes the normal request metadata described by its service; this integration does not claim zero data collection.

Create matching custom-event goals in Plausible:

- `Walkthrough explored` — opening a scenario, with its allowlisted scenario ID.
- `CV downloaded` — clicking a CV download link; does not prove download completion.
- `Contact opened` — opening email or LinkedIn.
- `Email copied` — successful clipboard write.
- `Inquiry submitted` — a valid form submission attempt; does not prove delivery.
- `Inquiry accepted` — the POST returned a successful HTTP response; does not prove inbox delivery.
- `Inquiry unconfirmed` — the response failed, the connection failed, or the request timed out; the message remains available for retry.
- `Project source opened` — opening a GitHub link.

Properties are limited to `locale` and an optional scenario ID. With no provider configured, the page only dispatches a transient `portfolio:engagement` browser event; nothing is stored or sent. Run Plausible's installation verifier and trigger each goal before relying on reports. Source: [installation](https://plausible.io/docs/plausible-script), [custom goals](https://plausible.io/docs/custom-event-goals).

## Availability and content

The hiring overview makes no availability claim by default. Set `PORTFOLIO_AVAILABILITY=open` only after choosing to advertise new opportunities, then rebuild. Role fit and collaboration preferences live in the typed feature dictionary; factual career history stays in the profile content.

Engineering notes live in `src/content/notes/en` and `es`, with paired stable `noteId` values. They are editorial drafts for this portfolio, not claims of measured production results. Review their voice and technical reasoning before publishing.

Gateway route examples and test links are pinned to a public repository commit. Update `src/content/gateway-scenarios.ts` when intentionally refreshing the evidence. The experiment dashboard screenshot is copied from the project's public documentation, with attribution and a caption distinguishing interface data from production evidence. A separate gateway response replay is generated from an actual local failure-and-recovery run. Its transcript, recording date, configuration, and source revision are published with it. The replay is not a dashboard recording or a production benchmark.
