---
locale: en
studyId: experimentation
kind: project
order: 4
title: Consistent experiments, server to browser.
description: Typed Laravel experimentation primitives with a TypeScript companion for consistent client hydration.
organization: Independent open source
role: Project author
period: Open-source engineering
tags: [Laravel, TypeScript, React & Vue]
result: One assignment
resultLabel: shared by the server and browser
visual: experimentation
repository: https://github.com/derian-cordoba/laravel-ab-testing
---

## The problem

An experiment needs more than randomly choosing a UI variant. Assignment should remain consistent, exposure should be distinguished from assignment, and the browser should display the variant the server selected.

This ecosystem separates backend experiment resolution from client-side consumption.

## The Laravel engine

The Laravel package documents typed experiment definitions, deterministic bucketing, sticky assignment persistence, exposure and metric recording, and Bayesian and frequentist analysis. Its dashboard supports inspecting experiments and results.

The repository also describes current limitations. Runtime-defined authoring and parts of the feature-flag platform are not presented as complete.

## The browser companion

The <a href="https://github.com/derian-cordoba/ab-testing-sdk" target="_blank" rel="noopener noreferrer">TypeScript SDK</a> consumes assignments the server has already resolved. It reads an SSR meta payload or an assignments API and normalizes those values into a shared client.

Optional React and Vue integrations build on that client. The SDK is not a standalone bucketing engine and does not independently track exposures or metrics.

## The central decision

**The server owns the assignment.** Reusing it in the browser avoids a second bucketing decision and helps prevent mismatches between rendered HTML and client state.

The SDK's layered architecture separates domain contracts, application orchestration, transport adapters, and framework integrations. That keeps browser transport concerns away from the public assignment contract.

## Evidence and scope

Both repositories document their integration contracts and usage. The visual on this page is a conceptual assignment flow, not live experiment data or a statistical result.
