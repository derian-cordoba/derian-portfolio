---
locale: es
studyId: secure-keys
kind: project
order: 5
title: 'Secure Keys: automatización de configuración para iOS'
description: Una herramienta de Ruby para generar frameworks de configuración de iOS a partir de secretos locales y de integración continua.
organization: Proyecto independiente de código abierto
role: Autor del proyecto
period: Desarrollo de código abierto
tags: [Ruby, Swift, CI/CD]
result: Local → CI → iOS
resultLabel: un flujo repetible de generación de frameworks
visual: secure-keys
repository: https://github.com/derian-cordoba/secure-keys
media:
  src: /images/secure-keys-xcode.png
  alt: 'Xcode con SecureKeys.xcframework configurado como Embed and Sign'
  caption: 'Captura de integración de la documentación del proyecto que muestra el framework generado añadido a un destino de Xcode.'
  source: https://github.com/derian-cordoba/secure-keys/blob/20984ae482046ab2562726d38b2ba3646d782eb4/docs/assets/add-xcframework-to-ios-project/third-step-result.png
  width: 1910
  height: 376
---

## El problema

La configuración de compilación de iOS debe funcionar tanto en el equipo de desarrollo como en integración continua. Repetir la configuración manualmente puede dificultar la reproducción de los distintos entornos.

Secure Keys reúne el proceso de generación de configuración en una herramienta de línea de comandos.

## Cómo funciona

La herramienta de Ruby lee los valores proporcionados desde macOS Keychain en el entorno local o desde variables de entorno en CI. Cifra los valores con AES-256-GCM, genera una API de Swift y construye un XCFramework para la aplicación de iOS.

El proceso documentado permite conjuntos de configuración distintos, rutas de salida y comparación de listas de claves entre entornos. Las opciones de distribución incluyen RubyGems y Homebrew.

## Prueba el flujo de generación

En macOS con Ruby 3.3 o posterior y las herramientas de línea de comandos de Xcode, ejecuta este ejemplo desde el directorio de un proyecto iOS. Usa un origen de API ilustrativo y no requiere crear credenciales ni escribir en Keychain.

```sh
gem install secure-keys
SECURE_KEYS_IDENTIFIER=apiOrigin APIORIGIN=https://example.invalid secure-keys --ci
```

La salida documentada es `.secure-keys/SecureKeys.xcframework`. Añade el framework al destino de la aplicación, como se muestra arriba, y lee el valor generado desde Swift:

```swift
import SecureKeys

let apiOrigin = SecureKey.apiOrigin.decryptedValue
```

Es un ejemplo de uso reproducible de la [documentación fijada a una revisión](https://github.com/derian-cordoba/secure-keys/blob/20984ae482046ab2562726d38b2ba3646d782eb4/README.md), no una transcripción de compilación capturada. Crear un XCFramework requiere las herramientas de Apple; el portafolio no ejecuta comandos Ruby.

## Decisiones y límites

**Adaptarse al origen.** Keychain y las variables de entorno de CI sirven a contextos de ejecución diferentes; la herramienta los incorpora a un mismo proceso de generación.

**Generar un artefacto utilizable.** Producir un XCFramework conecta la herramienta con la compilación de la aplicación, sin dejar la integración como una tarea manual sin documentar.

**Hacer explícitos los entornos.** Los conjuntos de configuración con nombre ayudan a describir qué claves pertenecen a cada contexto de compilación.

## Alcance de seguridad

Los valores cifrados incluidos en una aplicación cliente siguen siendo recuperables por un atacante con la capacidad suficiente. Este proceso no convierte una aplicación de iOS en una bóveda segura ni sustituye la gestión de secretos en el servidor.

Las claves que deben permanecer confidenciales pertenecen a un backend de confianza. El valor del proyecto es automatizar la compilación y gestionar la configuración, teniendo presente ese límite del cliente.

## Evidencia

El repositorio público documenta la instalación, el uso de la herramienta, la generación de frameworks y la gestión de entornos. Aquí no se afirma adopción en producción ni certificación de seguridad.
