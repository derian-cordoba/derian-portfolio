---
locale: en
studyId: secure-keys
kind: project
order: 5
title: 'Secure Keys: iOS Configuration Automation'
description: A Ruby CLI for generating iOS configuration frameworks from local and CI secret sources.
organization: Independent open source
role: Project author
period: Open-source engineering
tags: [Ruby, Swift, CI/CD]
result: Local → CI → iOS
resultLabel: a repeatable framework-generation workflow
visual: secure-keys
repository: https://github.com/derian-cordoba/secure-keys
media:
  src: /images/secure-keys-xcode.png
  alt: 'Xcode showing SecureKeys.xcframework configured as Embed and Sign'
  caption: 'Integration screenshot from the project documentation, showing the generated framework added to an Xcode target.'
  source: https://github.com/derian-cordoba/secure-keys/blob/20984ae482046ab2562726d38b2ba3646d782eb4/docs/assets/add-xcframework-to-ios-project/third-step-result.png
  width: 1910
  height: 376
---

## The problem

iOS build configuration needs to work on a developer's machine and in CI. Repeated manual setup can make environment management difficult to reproduce.

Secure Keys packages a configuration-generation workflow into a command-line tool.

## How it works

The Ruby CLI reads supplied values from macOS Keychain locally or environment variables in CI. It encrypts the values with AES-256-GCM, generates a Swift API, and builds an XCFramework for the iOS application.

The documented environment workflow supports distinct configuration sets, output paths, and comparison of environment key lists. Distribution options include RubyGems and Homebrew.

## Try the generation workflow

On macOS with Ruby 3.3+ and Xcode command-line tools installed, run this example from an iOS project directory. It uses an illustrative API origin, so it does not require creating credentials or writing to Keychain.

```sh
gem install secure-keys
SECURE_KEYS_IDENTIFIER=apiOrigin APIORIGIN=https://example.invalid secure-keys --ci
```

The documented output is `.secure-keys/SecureKeys.xcframework`. Add the framework to the application target, as shown above, then read the generated value from Swift:

```swift
import SecureKeys

let apiOrigin = SecureKey.apiOrigin.decryptedValue
```

This is a reproducible usage example from the [pinned CLI documentation](https://github.com/derian-cordoba/secure-keys/blob/20984ae482046ab2562726d38b2ba3646d782eb4/README.md), not a captured build transcript. Building an XCFramework requires the Apple toolchain; the portfolio itself runs no Ruby commands.

## Decisions and boundaries

**Adapt to the source.** Local Keychain and CI environment variables serve different execution contexts; the tool brings them into one generation workflow.

**Generate a usable artifact.** Producing an XCFramework connects the CLI to the application build rather than leaving integration as an undocumented manual task.

**Make environments explicit.** Named configuration sets help describe which keys belong to which build context.

## Security scope

Encrypted values embedded in a client application remain recoverable by a sufficiently capable attacker. This workflow does not turn an iOS application into a secure vault or replace server-side secret management.

Keys that must remain confidential belong on a trusted backend. The project's value is build automation and configuration handling, with that client-side boundary understood.

## Evidence

The public repository documents installation, CLI usage, framework generation, and environment management. No production adoption or security certification is claimed here.
