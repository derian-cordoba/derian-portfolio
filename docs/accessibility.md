# Accessibility audit

## Scope

Reviewed shared layout, header, footer, language/theme controls, links, form fields, inquiry form, screenshot dialog, simulation controls, disclosure panels, and global styles first.

Read the deployed HTML at `https://derian-cordoba-portfolio.netlify.app/` and these five additional routes:

- `/es/`
- `/hiring/`
- `/projects/api-gateway/`
- `/projects/experimentation/`
- `/notes/failure-controls/`

Then checked all 24 generated English and Spanish HTML pages. The form-enabled production build was used so contact controls were included.

## Findings and changes

| Area                                    | Finding                                                                                                      | Change                                                                                                                                                                                |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Skip navigation                         | The main landmark was not explicitly focusable.                                                              | Added `tabindex="-1"` so the skip link can move focus without adding another Tab stop.                                                                                                |
| Mobile navigation                       | No explicit relationship/state synchronization or application-level focus containment; no outside dismissal. | Added panel association, expanded-state synchronization, Tab/Shift+Tab containment, Escape focus restoration, outside pointer/focus dismissal, and closure at the desktop breakpoint. |
| Mobile navigation at zoom/short heights | An unconstrained panel could extend below the viewport.                                                      | Added a viewport-relative maximum height and vertical scrolling.                                                                                                                      |
| Screenshot viewer                       | The global outward focus outline could be clipped by the screenshot container.                               | Added an inset, two-color indicator and a forced-colors outline.                                                                                                                      |
| Screenshot dialog                       | Initial focus relied on browser defaults, with no explicit Tab boundary handler or caption association.      | Focus the close control, contain Tab/Shift+Tab, associate trigger/dialog/caption, and retain native modal behavior, Escape dismissal, and focus restoration.                          |
| Form controls                           | Decorative border colors were too faint to serve as control boundaries.                                      | Added a control-border token with tested minimum 3:1 contrast against paper and surface in both themes.                                                                               |
| Inquiry form                            | The form had no accessible landmark name or associated instructions/privacy description.                     | Associated the existing heading, instructions, and privacy text with the form.                                                                                                        |

The mobile navigation retains native disclosure/navigation semantics. It is not given an ARIA menu role or described as a modal. Native `<dialog>.showModal()` provides modal semantics and makes background content inert. Native disclosure operation and form submission remain available without JavaScript.

## Checks with no structural issues found

Across all 24 generated pages: one H1, no skipped heading levels, correct document language, image alt attributes, associated labels for non-hidden form fields, unique IDs, and resolvable ARIA controls/label/description references. Existing image descriptions are localized; decorative SVG icons are hidden from assistive technology. Visible text or accessible labels name interactive controls. Global focus and reduced-motion rules were already present.

The six sampled deployed documents also passed the language, heading, image-alt, unique-ID, and ARIA-reference HTML checks. HTML checks alone cannot establish that descriptions are useful to every reader or that rendered focus and contrast behave correctly in every browser.

## Verification and remaining browser checks

`PUBLIC_CONTACT_FORM_ENABLED=true npm run validate` checks Astro/TypeScript, lint, formatting, unit tests, production build, and static output. Contrast tests cover text palettes and the new control boundaries. Static regression coverage checks shared accessibility structure on every generated page.

`tests/e2e/accessibility.spec.ts` adds full axe scans for the six sampled routes in light and dark themes on desktop and mobile Chromium, plus skip-link focus, mobile-menu keyboard/dismissal behavior, and screenshot-dialog containment/restoration.

The browser run was attempted, but the preview server failed to start with `connect EPERM 127.0.0.1:57074`. No axe or keyboard browser test is claimed to have passed in this environment. Run after enabling the inquiry form and building:

```sh
PUBLIC_CONTACT_FORM_ENABLED=true npm run validate
npm run test:e2e
```

Before release, review visible focus at narrow/zoomed sizes and test the primary navigation, form errors, and screenshot dialog with a screen reader. This report is not a claim of complete WCAG conformance.

Reference patterns: [WAI disclosure navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) and [WAI modal dialogs](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).
