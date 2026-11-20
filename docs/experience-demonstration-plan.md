# Plan to demonstrate engineering experience

Prepared November 8, 2026. Planning assumption: target senior backend and senior full-stack roles, with technical leadership as a secondary direction. This is a proposed roadmap, not a claim that the projects or measurements already exist.

## Direction

Build a small, complete business application and show how it behaves under normal use, failure, and change. Your existing API Gateway, Laravel experimentation package, TypeScript SDK, and Secure Keys already provide engineering-tooling examples. The next application should connect implementation decisions to a user's workflow and an operator's responsibilities.

Work on one main project at a time. Default allocation: 10–12 hours per week for 12 weeks, approximately 120–144 hours. These are planning estimates; narrow features when milestones slip. Local execution and recorded demonstrations are sufficient initially; cloud hosting is optional and requires a separate budget decision.

## Evidence gaps to address

| Experience area                | Existing foundation                         | Evidence to add                                                                                    |
| ------------------------------ | ------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Enterprise full-stack delivery | Walmart role; Next.js, NestJS, TypeScript   | A complete workflow with permissions, validation, useful UI states, and operator actions           |
| SaaS and multi-tenancy         | Go Local Interactive role; Laravel services | Automated demonstrations of tenant boundaries across API requests and background jobs              |
| Performance modernization      | CV-reported Laravel improvement             | A separate reproducible benchmark with a baseline, workload, measurement method, and tradeoffs     |
| Reliability                    | Gateway policies and local recovery capture | Recovery from interrupted work, duplicate delivery, and unavailable dependencies in an application |
| Technical leadership           | All-Win responsibilities                    | Written decisions, scoped delivery milestones, real review feedback, and changes made in response  |
| Developer experience           | Public packages and CLI projects            | An independent developer completing setup and reporting concrete friction                          |

The recommendations reflect gaps in the reviewed public presentation. They do not imply that you lack these capabilities professionally.

## Project 1: tenant operations console — first priority

**Problem:** A company operator imports operational records, understands rejected rows, and recovers failed work without affecting another company.

Use a fictional agricultural supplier or distributor to connect the domain to your platform experience. This is an independent demonstration, with synthetic data and its own design.

**Suggested stack:** Next.js, NestJS, PostgreSQL, a worker, and Docker Compose. If using BullMQ/Redis, introduce it when asynchronous processing becomes necessary. Start with a modular monolith and a separately runnable worker; document what would justify splitting services later.

**Bounded first release:** two seeded companies, operator/admin permissions, one CSV import workflow, job status, rejected-row reporting, an audit trail, and an authorized retry action. Use seeded demo accounts. Defer billing, public signup, multiple import types, AI features, and Kubernetes until the core acceptance criteria pass.

**Engineering sequence:**

1. Implement the synchronous path: authenticate, select a company, authorize an action, validate a small import, persist records, and display a useful result.
2. Add bounded asynchronous processing, progress updates, validation failures, and cancellation or retry semantics. Specify what happens if a worker stops halfway through.
3. When introducing the queue, document the database-to-queue handoff. A transactional outbox can make a committed job discoverable after a crash; workers still need idempotent effects because delivery can repeat.
4. Add an operator view with job history, actionable errors, and audited recovery actions.
5. Trace one job from API acceptance through worker completion. Add metrics that answer operational questions, such as job failure rate, queue age, and processing duration.

**Acceptance criteria:**

- An operator from company A cannot read or mutate company B's records by changing identifiers, filters, or job IDs. Include negative tests for API access and worker context.
- Membership and role checks are enforced on the server. Tenant selection in the UI is not an authorization boundary.
- Concurrent submissions using the same tenant-scoped idempotency key do not create duplicate logical work. Define conflicts when the same key carries a different payload.
- Restarting a worker during an import produces a documented, testable outcome without duplicate logical records.
- Tests cover the database commit/queue handoff failure, duplicate delivery, invalid CSV content, and unavailable dependencies.
- Logs and traces support investigating a failed job without logging credentials or raw uploaded records.
- A new developer can run the seeded demonstration from documented commands. An independent reviewer verifies setup before release.

Start with application-enforced tenant isolation. PostgreSQL row-level security is an optional defense-in-depth follow-up, requiring tests using the actual application database role and pooled connections. Do not advertise isolation based only on a policy existing in the schema.

**Publishable evidence:** a tagged release, a 2–3 minute walkthrough, a concise architecture diagram, three decision records, meaningful integration tests, a reproducible workload, and an incident exercise showing diagnosis and recovery. Report only results obtained from the implementation.

## Project 2: Laravel modernization lab — second priority

Build a small legacy-style reporting endpoint with deterministic seeded data. Keep an executable baseline and an improved revision so someone can reproduce the difference.

Investigate realistic bottlenecks such as repeated queries, inefficient aggregation, or unnecessary data loading. Use profiling and query plans to choose changes. Preserve the response contract with regression tests; include the deployment and rollback steps for any schema change.

Measure query count, latency distribution, memory, and error rate under a stated workload. Record software versions, hardware, dataset size, concurrency, warm-up, cache conditions, and multiple runs. Include the benchmark scripts and raw results. If an optimization does not help or harms another workload, publish that finding.

**Completion criterion:** another person can compare baseline and optimized revisions using the same data and commands and explain why results differ. Avoid a preselected improvement percentage.

This demonstrates your modernization method independently. It does not validate or recreate the CV-reported 80% result from professional work.

## Existing projects: make them easier to evaluate

| Project                                  | Next useful demonstration                                                                                                                       | Completion criterion                                                                                                         |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| API Gateway                              | Put it in front of the flagship app after that app works directly; demonstrate an unavailable dependency and a recovery path                    | Show responses, traces, configuration, and the limits of the chosen failure policy                                           |
| Laravel experimentation + TypeScript SDK | Complete one small server-rendered experiment using the existing ecosystem; show assignment, hydration, and a separately defined exposure event | Refresh and navigation preserve the intended assignment; document identity changes and event deduplication                   |
| Secure Keys                              | Use a minimal sample iOS app and an authorized CI build with synthetic configuration                                                            | Show generation, integration, and a useful failure when configuration is missing; document the client-side security boundary |

These are follow-up options. Do not rebuild an existing gateway, experiment engine, SDK, or secret-generation CLI simply to add repository count. Select the demonstration most relevant to an actual role application after the flagship release.

## Twelve-week delivery sequence

| When      | Focus                               | Deliverable and decision gate                                                                                  |
| --------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Week 1    | Scope and experience inventory      | One-page problem brief, acceptance checklist, and six interview story outlines; freeze the first-release scope |
| Weeks 2–3 | Complete business path              | Seeded companies, authentication, server authorization, synchronous import, and usable UI states               |
| Weeks 4–5 | Asynchronous work                   | Worker, job status, tenant context, idempotent effects, and documented handoff semantics                       |
| Week 6    | Operator experience                 | Error reporting, audited retries, accessible forms, and one end-to-end workflow                                |
| Week 7    | Failure exercises                   | Restart/duplicate-delivery tests and a short incident report with actual observations                          |
| Week 8    | Operations and review               | Traces, useful metrics, reproducible local setup, and the first independent setup review                       |
| Week 9    | Measurement and scope buffer        | Baseline workload, actual measurements, fixes from review; postpone enhancements if the core is incomplete     |
| Week 10   | Laravel lab                         | One reporting flow with a reproducible before/after comparison; stop at one well-explained optimization        |
| Week 11   | Evidence and communication          | Tagged releases, demo recordings, decision records, and two concise case-study drafts                          |
| Week 12   | External evaluation and publication | Repeat setup with a reviewer, resolve the most important findings, and publish reviewed portfolio evidence     |

If the Laravel lab needs more than the allocated week, deliver a smaller complete experiment or schedule it after week 12. Keep the flagship usable and documented before starting that lab. The gateway integration, experimentation demo, and iOS sample are optional follow-up work, not simultaneous twelve-week commitments.

## Turn professional experience into stronger stories

Prepare one story per row. Collect the actual details before publishing; the prompts below are questions, not assertions about internal systems.

| Experience                | Story to prepare                                                  | Details to recover                                                                                                          |
| ------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Walmart                   | A reusable capability or full-stack workflow you helped deliver   | Original duplication or workflow problem, your ownership, consumers, rollout, validation, and maintainability tradeoff      |
| Go Local Interactive      | A specific processing improvement and a separate tenancy decision | Metric definition, baseline, workload, implementation change, tenant-context propagation, and what you personally delivered |
| Netforemost               | A safe change to a legacy Laravel workflow                        | Previous behavior, regression risk, tests added, migration or rollout approach, and review/documentation impact             |
| All-Win                   | A change to team delivery practices                               | Your authority and contribution, how the team adopted it, feedback, a difficult tradeoff, and observable outcomes           |
| Quality Service Nicaragua | A service or data boundary in the agricultural platform           | Business rule, API/data model decision, integration constraint, and which usage figures are documented                      |
| TiHouse / Disanic         | A foundational API or authentication decision                     | Requirements, your responsibility, failure handling, and how the design evolved                                             |

For each story, write: context → constraint → personal contribution → alternatives → decision → validation → result → lesson. Prepare a 90-second version and a five-minute technical version. Include an artifact where publishable: a sanitized diagram, a decision record, a benchmark method, or a public implementation reference.

Use quantities only when supported. Team size, query counts, latency, deployment frequency, adoption, and cost savings need their own evidence. A public recreation should be explicitly labeled and should not imply access to employer code or reveal private implementation details.

## Demonstrate leadership through the work

- Write three short decision records: tenant boundaries, asynchronous processing, and deployment/recovery. Include rejected alternatives and conditions for revisiting the choice.
- Ask a consenting engineering peer to review one design and one change. Preserve publishable feedback and explain what changed because of it.
- Track scope decisions and release milestones in repository issues. Document one feature deferred to protect delivery quality.
- Run a small incident exercise with a timeline, detection, diagnosis, recovery, and follow-up actions.

These artifacts demonstrate communication and judgment. Describe solo work and external reviews accurately; do not turn them into a claim of leading a production team.

## Definition of a useful portfolio addition

A reviewer should be able to understand the problem in 30 seconds, watch the principal workflow in three minutes, and inspect the implementation and its limits from linked source. Each case study should explain one difficult decision and one failure path.

Track completed, reproducible demonstrations; successful independent setup; review findings resolved; and the quality of questions raised in interviews. Stars, repository count, and synthetic performance numbers alone do not establish professional impact. Record genuine users and feedback if adoption occurs; do not make adoption a prerequisite for finishing the first release.

## Technical references

- [AWS Builders' Library: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) — informs the retry and duplicate-request exercises.
- [OpenTelemetry demo](https://opentelemetry.io/docs/demo/) — reference for demonstrating instrumentation and operational scenarios; the proposed application can remain much smaller.
- [PostgreSQL row security policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) — optional database isolation work, including the distinctions between normal application roles and roles that bypass policies.
