---
locale: es
studyId: experimentation
kind: project
order: 4
title: Experimentos consistentes, del servidor al navegador.
description: Primitivas de experimentación tipadas en Laravel con un SDK de TypeScript para una hidratación consistente del cliente.
organization: Proyecto independiente de código abierto
role: Autor del proyecto
period: Desarrollo de código abierto
tags: [Laravel, TypeScript, React y Vue]
result: Una asignación
resultLabel: compartida entre el servidor y el navegador
visual: experimentation
repository: https://github.com/derian-cordoba/laravel-ab-testing
---

## El problema

Un experimento necesita más que elegir aleatoriamente una variante de interfaz. La asignación debe mantenerse consistente, la exposición debe distinguirse de la asignación y el navegador debe mostrar la variante seleccionada por el servidor.

Este ecosistema separa la resolución de experimentos en el backend de su consumo en el cliente.

## El motor de Laravel

El paquete de Laravel documenta definiciones de experimentos tipadas, distribución determinista, persistencia de asignaciones estables, registro de exposiciones y métricas, y análisis bayesiano y frecuentista. Su panel permite inspeccionar experimentos y resultados.

El repositorio también describe sus limitaciones actuales. La creación de experimentos en tiempo de ejecución y partes de la plataforma de indicadores de funcionalidades no se presentan como terminadas.

## El complemento del navegador

El <a href="https://github.com/derian-cordoba/ab-testing-sdk" target="_blank" rel="noopener noreferrer">SDK de TypeScript</a> consume asignaciones que el servidor ya ha resuelto. Lee datos de una etiqueta meta de SSR o de una API de asignaciones y normaliza esos valores en un cliente compartido.

Las integraciones opcionales con React y Vue se construyen sobre ese cliente. El SDK no es un motor independiente de distribución y no registra exposiciones o métricas por sí solo.

## La decisión central

**El servidor es responsable de la asignación.** Reutilizarla en el navegador evita una segunda decisión de distribución y ayuda a prevenir diferencias entre el HTML renderizado y el estado del cliente.

La arquitectura por capas del SDK separa contratos de dominio, coordinación de la aplicación, adaptadores de transporte e integraciones con frameworks. Así mantiene los detalles del transporte del navegador separados del contrato público de asignación.

## Evidencia y alcance

Ambos repositorios documentan sus contratos de integración y su uso. El gráfico de esta página es un flujo conceptual de asignación, no datos de un experimento en vivo ni un resultado estadístico.
