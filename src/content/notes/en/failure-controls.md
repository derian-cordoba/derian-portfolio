---
locale: en
noteId: failure-controls
title: 'Timeouts, retries, and circuit breakers have different jobs.'
description: 'A practical way to reason about failure boundaries without multiplying load.'
order: 1
tags: [Reliability, TypeScript]
---

## Begin with the request budget

A dependency can fail by returning an error, responding too slowly, or never completing a response. Before choosing a resilience control, decide how much time the caller can afford to spend waiting. A useful policy fits inside that budget and leaves room for the caller to handle the result.

In the API Gateway example, `proxy.timeout` controls the wait for an upstream response to begin. It is not a general deadline for every byte in a streaming response. That distinction matters when designing long-lived connections or large downloads.

## Give each control one responsibility

A timeout bounds a single wait. A retry repeats an attempt. A circuit breaker uses previous failures to decide whether another call should happen at all. They can work together, but one cannot replace the others.

For a slow dependency, the gateway can return a 504 when the configured timeout expires. Once a circuit is open, later calls can receive a 503 without reaching that dependency. Those outcomes tell the caller different things: an attempted operation exceeded its waiting budget, or the gateway rejected the attempt because the dependency was considered unhealthy.

## Retries spend time and capacity

Suppose a request has a short overall budget. Several full-length attempts plus backoff can exceed it even when every individual timeout appears reasonable. Extra attempts also consume capacity at precisely the moment a service may be struggling.

Before retrying a write, establish whether it can safely be repeated. An idempotency key only helps when the receiving service actually enforces its semantics. A client-generated identifier by itself does not prevent duplicate work.

## Define what recovery means

An open circuit should eventually allow a controlled probe. In a multi-process deployment, deciding who probes and who updates shared state introduces another coordination problem. Last-write-wins snapshots can share observations while still allowing conflicting transitions.

This is why a diagram alone is not enough evidence for a distributed reliability guarantee. Review the store contract, concurrency behavior, and integration tests before depending on that guarantee.

## Inspect the implementation

The portfolio walkthrough links the published route examples and tests. Change one policy at a time, observe the resulting response, and test both failure and recovery. These notes describe design reasoning; they do not present a production benchmark.

[Explore the gateway walkthrough](/projects/api-gateway/#walkthrough).
