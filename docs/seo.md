# SEO content and measurement

The portfolio targets name, project, and specific engineering-topic discovery. The content update keeps existing routes stable and provides descriptive English/Spanish project titles, answer-first engineering notes, editorial dates, and reciprocal project/note links. The repository declares `https://derian-cordoba.me` as its canonical origin and configures the `www` redirect in `netlify.toml`. Confirm DNS, HTTPS, and the active deployment independently.

## Content maintenance

Study `title` values drive the visible headings, cards, document titles, and social titles. Prefer the technology or project name followed by the problem it addresses. Descriptions explain scope instead of repeating the title. Do not change a stable slug simply to change a title.

Notes start with a short, self-contained answer followed by detailed reasoning. `publishedAt` is an explicit ISO date reflecting initial publication; the existing notes were introduced on November 3, 2026. Add `updatedAt` only for a substantive revision. The schema rejects an update preceding publication. Dates are rendered in the page language without changing across visitor time zones.

`relatedNotes` contains stable note IDs on a study. The view model resolves the same-language entries and fails the build if a required translation is missing. Notes link back to the relevant project or walkthrough.

The Laravel performance percentage remains attributed to the supplied CV. Before expanding that case study, obtain the actual metric, bottleneck, implementation change, baseline, workload, measurement method, and disclosure constraints. A CV reference is not independent benchmark evidence. Do not invent execution times, query counts, or causal details to make the story more specific.

## Search Console activation

A public HTML verification value is configured in `netlify.toml`. This is not proof that Search Console ownership verification has completed; confirm that state in the owner’s account.

1. In [Google Search Console](https://search.google.com/search-console), add a **URL-prefix** property for the public URL you want to inspect. Use the exact HTTPS prefix. A Netlify URL-prefix property does not require purchasing a domain.
2. Choose HTML-tag verification and copy only the supplied `content` value into the production build environment variable `PUBLIC_GOOGLE_SITE_VERIFICATION`.
3. Redeploy, confirm the public homepage contains the verification meta tag, and select Verify in Search Console.
4. Inspect the homepage and one project URL. Review accessibility to Google's crawler and the declared/selected canonical URLs. The declared canonical domain and hosting redirects are configured in source; source configuration does not establish that the domain is indexed.
5. Submit the generated sitemap when its declared public URLs are reachable. Review indexing reports before expecting search-performance data.

References: [Search Console setup](https://developers.google.com/search/docs/monitor-debug/search-console-start), [descriptive titles](https://developers.google.com/search/docs/appearance/title-link), [editorial dates](https://developers.google.com/search/docs/appearance/publication-dates).

## Engagement activation and interpretation

Plausible remains optional and disabled without `PUBLIC_PLAUSIBLE_SCRIPT_URL`. Register the actual public hostname in Plausible and use its supplied script URL. If measuring the Netlify hostname separately, `PUBLIC_ANALYTICS_HOSTNAME=derian-cordoba-portfolio.netlify.app` can explicitly enable measurement on that host without changing canonical URLs. Leaving the override empty uses `SITE_URL`'s hostname. Other hosts and deploy previews remain excluded by default.

Create the custom goals documented in [deployment setup](deployment.md). Interpret each signal accurately:

| Signal                                           | Meaning                                    | Follow-up                                                                                       |
| ------------------------------------------------ | ------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Search Console impressions, queries, clicks      | Actual search visibility and search visits | Review name, project, and engineering-topic queries                                             |
| `Walkthrough explored` / `Project source opened` | Interest in technical evidence             | Compare projects and languages                                                                  |
| `CV downloaded`                                  | Click on a CV link                         | It does not prove the download completed                                                        |
| `Contact opened` / `Email copied`                | Contact intent                             | It does not prove a message was sent                                                            |
| `Inquiry submitted`                              | Valid browser submission attempt           | Compare against Netlify's stored submissions                                                    |
| `Inquiry accepted` / `Inquiry unconfirmed`       | HTTP acceptance or an unconfirmed response | Separate successful POST handling from retries and failures; neither establishes inbox delivery |
| Netlify verified submissions                     | Provider-stored inquiries                  | Exclude diagnostics/spam and manually identify relevant opportunities                           |

Qualified contacts are a business judgment, not a browser event. Do not send inquiry contents, names, or email addresses to analytics. Netlify inbox delivery and notification rules are separate from the HTTP response and should be checked in the owner's dashboard. Diagnostic submissions may be classified as spam and are not leads.

Review monthly, or after a meaningful change: indexing issues, relevant queries, project interest, CV clicks, and qualified inquiries. Use real field-performance data when it becomes available; this update introduces no rendering-framework rewrite.

## Public deployment checks

After deploying the updated source, run:

```sh
DEPLOYMENT_URL=https://derian-cordoba-portfolio.netlify.app npm run test:deployed
```

These read-only HTTP checks cover all 26 localized pages, metadata consistency, descriptive project titles, reciprocal note links, publication dates, robots/sitemap consistency, and Netlify's processed form markup. They request only the configured deployment URL; they do not verify DNS, establish indexing, run a browser accessibility audit, or prove inbox delivery. Running them against an older deployment can fail the new content checks until the new source is deployed.

To explicitly test actual form POST handling, including one clearly marked diagnostic inquiry in each language:

```sh
DEPLOYMENT_URL=https://derian-cordoba-portfolio.netlify.app SUBMIT_TEST_INQUIRIES=true npm run test:deployed
```

The POST checks require an HTTP 200 response containing the expected localized confirmation page. They do not treat a successful GET of that page as evidence of submission success. Automatic POST testing is off by default.

The same checks are available through **Actions → Public deployment checks → Run workflow**, with an optional submission checkbox. The ordinary source-validation workflow remains independent of external availability and sends no live messages.

Article pages include `BlogPosting` structured data with editorial dates and a shared author identity. Study pages include `CreativeWork` metadata. Each localized note and study has a generated 1200 × 630 PNG social card. Validate structured data against the deployed HTML after release; no enhanced search result is guaranteed.
