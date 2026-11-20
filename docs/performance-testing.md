# Performance testing

This repository uses [k6](https://grafana.com/docs/k6/latest/) to exercise the deployed static site over HTTP. The shared adapter in `tests/performance/lib/site.js` owns the base URL, representative route mix, checks, and common service-level objectives. Scenario files only define the traffic shape, so new profiles can reuse the same behavior without copying request logic.

## What is measured

Each iteration requests one randomly selected route from this mix:

| Route | What it covers |
| --- | --- |
| `/` | English homepage |
| `/es/` | Spanish homepage |
| `/hiring/` | Hiring overview |
| `/notes/` | Notes index |
| `/projects/experimentation/` | Long-form project page |
| `/robots.txt` | Small static text asset |

The checks require 2xx/3xx responses and HTML content types for page routes. Shared thresholds are fewer than 1% failed requests, at least 99% passing checks, p95 below 1 second, and p99 below 2 seconds. These are starting budgets for the public site, not a claim of measured production capacity. Establish a baseline against the target host before using them as a release gate; adjust only with documented evidence and user-facing expectations.

These scripts measure server/CDN HTTP response behavior. They do not measure browser rendering, Core Web Vitals, form delivery, or authenticated traffic. Playwright and deployed form checks remain separate tools for those concerns.

## Prerequisites and run

Install k6 using the instructions for your operating system at [grafana.com/docs/k6/latest/set-up/install-k6](https://grafana.com/docs/k6/latest/set-up/install-k6/). It is an external executable and is deliberately not added as a Node dependency.

For a local baseline, build and serve the production output in one terminal:

```sh
npm run build
npm run preview
```

Then run a profile in another terminal:

```sh
npm run perf:smoke
npm run perf:load
npm run perf:spike
```

Set `BASE_URL` to target a preview or staging deployment. Include the scheme, and do not point a spike profile at a production host without an agreed test window:

```sh
BASE_URL=https://staging.example.com npm run perf:smoke
```

| Profile | Shape | Use |
| --- | --- | --- |
| Smoke | 1 virtual user, 18 iterations | Confirm routes and thresholds before a longer run |
| Load | Ramp to 10 users, sustain, then ramp to 25 for five minutes | Check ordinary and elevated sustained traffic |
| Spike | 5 users to 60 in 20 seconds, sustain for one minute, recover | Check sudden demand and recovery |

The configured user counts are reproducible starting profiles. Tune them to realistic traffic estimates and host limits. k6 reports request rate, latency percentiles, checks, and failures to the terminal. To keep an artifact, use k6's `--summary-export` option, for example:

```sh
k6 run --summary-export=performance-results/smoke.json tests/performance/scenarios/smoke.js
```

The `performance-results/` directory is ignored by git so result artifacts do not accidentally enter source control.

## Grafana

For hosted dashboards and run history, use Grafana Cloud k6. Create a Cloud k6 project, set the `K6_CLOUD_TOKEN` secret in your shell or CI environment, and run:

```sh
k6 cloud tests/performance/scenarios/load.js
```

The dashboard should compare the run's request rate, p95/p99 duration, failed-request rate, and per-page tags. Keep separate baselines for local preview, staging, and production because their networks and caching differ. Never commit the cloud token. For self-hosted Grafana, use a documented k6 output supported by your installed k6 and Prometheus setup; output flags and backend compatibility vary by k6 version.

## Operating the tests

1. Run smoke against the exact target first and confirm all routes exist.
2. Capture at least three load runs under comparable conditions. Record target URL/environment, commit SHA, date, and cache state alongside the exported summary.
3. Compare median run values and investigate regressions in error rate and p95/p99, including CDN cache misses, origin response time, and deployment changes.
4. Run the spike profile only on a controlled host and watch host-level rate limits and availability during the test.
5. Revisit route mix and budgets when pages or hosting architecture change.

Do not treat a local preview result as a production capacity guarantee: the local server, machine, and network path are different from the deployed CDN and origin.
