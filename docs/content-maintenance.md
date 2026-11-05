# Content maintenance

## Career and CVs

`src/content/career.json` is the shared source for company identity, employment dates, and English/Spanish website roles and summaries. Dates use `YYYY-MM`; `career-period.ts` produces localized labels. Keep current employment open-ended and mark part-time work explicitly.

CV editing, translation, and PDF export are manual. Replace the public English and Spanish PDFs when ready. There is no generator or translation command. Compare roles and dates against the website before release; the build checks PDF availability but does not establish editorial consistency inside a manually maintained PDF.

## Professional evidence

The Laravel and All-Win pages use responsibilities documented in the supplied CV. Additional detail needs a publishable source. For a performance claim, collect the metric, before/after values, workload, measurement procedure, personal contribution, and disclosure constraints. Do not infer execution times or architecture choices from a percentage.

For a leadership story, distinguish personal ownership from team output. Add team size, rollout details, or quantified delivery improvements only when verified. Both translations must keep the same heading hierarchy so section links survive language changes.

## Project evidence

Record public source attribution and pin implementation evidence to a revision. The gateway capture script asserts its local responses before writing the transcript. Review the recorded revision and any modified-checkout label, then regenerate the replay whenever refreshing the capture. The one-second recovery delay is a demonstration setting, distinct from the ten-second policy in the separate published walkthrough examples.

The Secure Keys commands are documentation-derived examples requiring macOS, Ruby, and Xcode; the integration screenshot comes from the project's documentation. They are not presented as a captured build.

Keep original media in `public/images/` and a matching optimization source in `src/assets/studies/`. Verify dimensions, localized alt text, attribution, mobile layout, and enlargement. The build fails when a study's optimization source is absent. The browser retains the full original for enlargement while article images use responsive AVIF/WebP sources.

## Before releasing

Run `npm run validate`, then build with `PUBLIC_CONTACT_FORM_ENABLED=true` and run the browser suite to include inquiry recovery coverage. Check representative pages in both languages and themes. Publish only reviewed content; confirm deployed metadata, form handling, and any configured analytics separately. A successful local mock submission is not proof of Netlify storage or inbox delivery.
