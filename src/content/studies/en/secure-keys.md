---
locale: en
studyId: secure-keys
kind: project
order: 5
title: A repeatable path from config to build.
description: A Ruby CLI for generating iOS configuration frameworks from local and CI secret sources.
organization: Independent open source
role: Project author
period: Open-source engineering
tags: [Ruby, Swift, CI/CD]
result: Local → CI → iOS
resultLabel: a repeatable framework-generation workflow
visual: secure-keys
repository: https://github.com/derian-cordoba/secure-keys
---

## The problem

iOS build configuration needs to work on a developer's machine and in CI. Repeated manual setup can make environment management difficult to reproduce.

Secure Keys packages a configuration-generation workflow into a command-line tool.

## How it works

The Ruby CLI reads supplied values from macOS Keychain locally or environment variables in CI. It encrypts the values with AES-256-GCM, generates a Swift API, and builds an XCFramework for the iOS application.

The documented environment workflow supports distinct configuration sets, output paths, and comparison of environment key lists. Distribution options include RubyGems and Homebrew.

## Decisions and boundaries

**Adapt to the source.** Local Keychain and CI environment variables serve different execution contexts; the tool brings them into one generation workflow.

**Generate a usable artifact.** Producing an XCFramework connects the CLI to the application build rather than leaving integration as an undocumented manual task.

**Make environments explicit.** Named configuration sets help describe which keys belong to which build context.

## Security scope

Encrypted values embedded in a client application remain recoverable by a sufficiently capable attacker. This workflow does not turn an iOS application into a secure vault or replace server-side secret management.

Keys that must remain confidential belong on a trusted backend. The project's value is build automation and configuration handling, with that client-side boundary understood.

## Evidence

The public repository documents installation, CLI usage, framework generation, and environment management. No production adoption or security certification is claimed here.
