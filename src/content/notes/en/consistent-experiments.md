---
locale: en
noteId: consistent-experiments
title: 'Keep experiment assignment consistent from server to browser.'
description: 'Why server-owned assignment and explicit exposure events make experiments easier to trust.'
order: 2
tags: [Experiments, SSR]
---

## Choose one assignment authority

A server-rendered application can choose an experiment variant before sending HTML. If browser code independently chooses again, the visitor may see one variant in the initial response and another after hydration. That introduces visual changes and makes the recorded experience harder to interpret.

A clearer contract lets the server own assignment and exposes that result to the browser. The browser reads the decision rather than recreating the assignment algorithm. In this project family, the Laravel package handles experiments while the JavaScript SDK consumes server-provided assignments.

## Make missing assignments explicit

A browser client can start before assignment data is available. Decide what that means: use the control experience, defer the experiment surface, or render a neutral state. Avoid silently treating missing data as a successful experimental assignment.

The default must agree with the initial HTML. Otherwise a fallback intended to make the page resilient can reintroduce the mismatch it was meant to avoid.

## Separate assignment from exposure

Being assigned a variant does not necessarily mean seeing it. A visitor may never reach the relevant section, or a navigation may end before the component renders. Counting every assignment as an exposure can distort the denominator used to interpret results.

Define the exposure boundary around the experience being tested. Then decide how repeat views, navigation, and component remounts affect that event. Conversion events need their own definition and deduplication rules. Reading assignment data in a component is not proof that an exposure or conversion was recorded.

## Treat identity as part of the contract

Stable assignment requires a stable subject. Think through anonymous visits, sign-in, and changes to the identifier. If the identifier changes, reassignment may be expected; document that behavior so product and engineering teams can interpret it consistently.

Also keep allocation changes explicit. A deterministic algorithm does not automatically promise that every visitor stays in the same variant after experiment configuration changes.

## Inspect both halves

Review the Laravel case study for the server responsibilities and the SDK repository for browser integration. Test initial rendering, hydration, missing assignments, and navigation together. A consistent UI is necessary, but reliable conclusions also depend on sound event definitions and experiment design.

[Explore the experimentation project](/projects/experimentation/).
