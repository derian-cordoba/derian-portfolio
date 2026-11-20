# Projects to demonstrate engineering experience

Updated November 9, 2026. This document summarizes the recommendations discussed in the chat, including progress on TiHouse. The [original detailed plan](experience-demonstration-plan.md) contains the acceptance criteria and engineering sequence.

## Objective

Strengthen the portfolio for senior backend and senior full-stack roles through complete, reproducible demonstrations. Connect each project to professional experience and show implementation decisions, failure handling, and evidence of results.

Work on one main project at a time. Finish the TiHouse case study, complete one measurable Laravel optimization, then select an existing-project demonstration relevant to the roles being pursued.

## 1. Tenant operations console — first priority

**Problem:** An operator imports business records, reviews rejected rows, and recovers failed work without affecting another company.

**Scope:** Two companies, admin/operator permissions, CSV imports, a background worker, job history, row validation, audit events, and authorized retries. Prevent duplicate logical work with company-scoped request keys.

**Experience demonstrated:** Enterprise full-stack delivery, SaaS tenancy, authorization, asynchronous processing, and operational reliability. Relevant to the Walmart, Go Local Interactive, and agricultural platform experience.

### Current progress

The quick demo was implemented in TiHouse using PHP, SQL Server, and Docker Compose. It includes synthetic accounts and records, server-side company membership checks, background CSV processing, rejection details, and administrator retries.

API checks, expired-lease recovery checks, browser checks, and existing application regression checks passed during implementation. An expired-lease exercise is distinct from stopping a running worker during an import; that interruption exercise remains a next step.

The original proposed stack was Next.js, NestJS, and PostgreSQL. Continue with the working TiHouse implementation; a rewrite is unnecessary for this demonstration. The new module's authorization checks do not establish equivalent protection for all legacy APIs.

### Next steps

- Document the architecture and the SQL-backed queue's transaction and recovery behavior.
- Test concurrent duplicate submissions and conflicting payloads under the same request key.
- Stop a worker during processing and verify recovery without duplicate logical records.
- Exercise unavailable dependencies and document the observed outcome.
- Add operational measurements: queue age, processing duration, and job failure rate.
- Write three decision records covering company boundaries, background processing, and recovery.
- Ask an independent developer to verify setup, address their feedback, and record a two-to-three-minute walkthrough.
- Prepare a tagged release and a portfolio case study with actual results and remaining limits.

## 2. Laravel modernization lab — second priority

**Problem:** A reporting endpoint performs unnecessary work and needs a safe, measurable improvement.

Build a small reporting workflow with deterministic seeded data. Preserve executable baseline and optimized versions. Investigate one bottleneck, such as repeated queries, inefficient aggregation, or excessive data loading.

**Experience demonstrated:** Performance investigation and safe legacy modernization, relevant to Go Local Interactive and Netforemost.

**Deliverables:**

- Regression tests preserving the response contract.
- Profiling evidence and relevant query plans.
- Reproducible query-count, latency, memory, and error measurements.
- Dataset size, concurrency, software versions, hardware, warm-up, and cache conditions.
- Benchmark scripts, raw results, tradeoffs, and rollout/rollback instructions.

**Completion criterion:** Another developer can reproduce and explain the difference. Publish the measured outcome without choosing an improvement percentage in advance. This experiment does not validate employer-system performance claims.

## 3. API Gateway — extend the existing project

Put the existing gateway in front of TiHouse after the application works directly. Demonstrate a slow or unavailable dependency, the response received by the client, and recovery.

**Experience demonstrated:** Integration design, resilience policies, observability, and failure diagnosis.

**Deliverables:** Runnable configuration, integration tests, captured responses, and an explanation of timeout, retry, and circuit-breaker decisions and their limits.

**Completion criterion:** A reviewer can reproduce the failure and recovery path and connect the observed behavior to the configuration.

## 4. Laravel experimentation package + TypeScript SDK

Complete one small application using the existing packages. Demonstrate server-side assignment, frontend hydration, assignment persistence across navigation, and a separately defined exposure event.

**Experience demonstrated:** Reusable package design, backend/frontend integration, identity handling, and developer experience.

**Deliverables:** A working sample application, integration tests, and documentation covering identity changes and event deduplication.

**Completion criterion:** Refresh and navigation preserve the intended assignment, with explicit behavior for identity changes and repeated exposure events.

## 5. Secure Keys + sample iOS application

Integrate Secure Keys into a minimal iOS application using synthetic configuration and a CI build. Demonstrate successful generation and integration, followed by a useful failure when required configuration is missing.

**Experience demonstrated:** Mobile tooling, automation, CI/CD, and integration documentation; relevant to the cross-platform work at All-Win.

**Deliverables:** A runnable sample, CI configuration, integration instructions, and a missing-configuration example.

**Completion criterion:** Another developer can reproduce the integration and understand the client-side security boundary. Configuration shipped to an application should not be described as permanently secret.

## Delivery plan

The original estimate was 10–12 hours per week for 12 weeks. Use it as a planning guide rather than restarting work already completed in TiHouse.

| Period      | Focus                          | Deliverable                                                          |
| ----------- | ------------------------------ | -------------------------------------------------------------------- |
| Week 1      | Scope and experience inventory | Problem statement, acceptance checklist, interview story outlines    |
| Weeks 2–3   | Complete business workflow     | Authentication, company permissions, import, useful UI states        |
| Weeks 4–5   | Background processing          | Worker, job status, idempotency, documented recovery behavior        |
| Week 6      | Operator experience            | Actionable errors, audited retries, end-to-end demonstration         |
| Week 7      | Failure exercises              | Worker interruption tests and a short incident report                |
| Weeks 8–9   | Operations and review          | Metrics, reproducible workload, independent setup review             |
| Week 10     | Laravel modernization lab      | One reproducible before/after optimization                           |
| Weeks 11–12 | Publication                    | Recordings, decision records, tagged releases, reviewed case studies |

Start with TiHouse's remaining acceptance criteria. If the Laravel experiment exceeds its allocation, reduce its scope or schedule it after the flagship release. Gateway integration, experimentation, and the iOS sample are optional follow-ups rather than simultaneous commitments.

## Make professional experience more specific

Prepare one evidence-backed story for each experience area. These are prompts to collect details, not assertions about private systems.

| Experience                | Story to develop                                                                                                |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Walmart                   | A reusable capability or full-stack workflow: personal ownership, consumers, rollout, validation, and tradeoffs |
| Go Local Interactive      | One processing improvement and one tenancy decision, including measurement methods and personal contribution    |
| Netforemost               | A safe legacy Laravel change: regression risks, tests, rollout, and documentation                               |
| All-Win                   | A delivery-practice improvement: team adoption, feedback, difficult decisions, and observable outcomes          |
| Quality Service Nicaragua | An agricultural business rule translated into services, database structures, and integration boundaries         |
| TiHouse / Disanic         | An API, authentication, or data-model decision and how it evolved                                               |

For each story, write:

**Context → constraint → personal contribution → alternatives → decision → validation → result → lesson.**

Prepare a 90-second explanation and a five-minute technical version. Link a publishable artifact when available, such as a sanitized diagram, a decision record, a benchmark, or a public implementation.

Use supported quantities, distinguish individual contributions from team results, and label public recreations clearly. Keep company credentials, data, and private implementation details out of these artifacts.

## Definition of done for a portfolio case study

- A reviewer understands the problem in 30 seconds.
- A short recording demonstrates the principal workflow in approximately three minutes.
- Documented commands reproduce the application using synthetic data.
- Source and meaningful tests support the stated behavior.
- The case study explains one difficult decision, one failure path, measured results where applicable, and remaining limits.
- Independent setup feedback is recorded and the important findings are addressed.

Prioritize complete evidence over repository count. Do not present proposed features, synthetic benchmarks, or solo demonstrations as production adoption or employer impact.
