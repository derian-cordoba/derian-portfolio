---
locale: es
noteId: consistent-experiments
title: 'Mantener la asignación de experimentos entre servidor y navegador.'
description: 'Por qué asignar en el servidor y definir las exposiciones ayuda a interpretar los experimentos.'
publishedAt: '2026-11-03'
order: 2
tags: [Experimentos, SSR]
---

Resuelve la asignación del experimento una sola vez en el servidor y comparte esa decisión con el navegador. El navegador debe mostrar la variante asignada en lugar de elegir otra vez. Define la exposición por separado: recibir una variante no significa automáticamente haberla visto.

## Elige una sola autoridad de asignación

Una aplicación renderizada en el servidor puede elegir una variante antes de enviar el HTML. Si el navegador vuelve a elegir por su cuenta, la persona puede ver una variante en la respuesta inicial y otra después de la hidratación. Esto genera cambios visuales y dificulta interpretar qué experiencia se registró.

Un contrato más claro deja la asignación en el servidor y expone el resultado al navegador. El navegador lee la decisión en lugar de repetir el algoritmo. En esta familia de proyectos, el paquete Laravel gestiona los experimentos y el SDK de JavaScript consume las asignaciones del servidor.

## Haz explícitas las asignaciones ausentes

Un cliente del navegador puede iniciarse antes de disponer de las asignaciones. Decide qué significa: mostrar el control, aplazar la superficie experimental o presentar un estado neutral. Evita interpretar silenciosamente la ausencia de datos como una asignación experimental correcta.

El valor predeterminado debe coincidir con el HTML inicial. De lo contrario, una alternativa pensada para mejorar la resiliencia puede volver a introducir la inconsistencia que intentaba evitar.

## Separa la asignación de la exposición

Recibir una variante no significa necesariamente verla. La persona puede no llegar a la sección correspondiente o abandonar la navegación antes de que se renderice el componente. Contar cada asignación como una exposición puede distorsionar el denominador con el que se interpretan los resultados.

Define la exposición alrededor de la experiencia que se está evaluando. Después decide cómo influyen las vistas repetidas, la navegación y los nuevos montajes del componente. Las conversiones necesitan su propia definición y reglas de deduplicación. Leer la asignación en un componente no demuestra que se haya registrado una exposición o conversión.

## Trata la identidad como parte del contrato

Una asignación estable necesita un sujeto estable. Considera las visitas anónimas, el inicio de sesión y los cambios de identificador. Si este cambia, una nueva asignación puede ser esperable; documenta ese comportamiento para que producto e ingeniería lo interpreten de forma consistente.

Haz explícitos también los cambios de distribución. Un algoritmo determinista no garantiza por sí solo que todas las personas conserven su variante después de modificar la configuración del experimento.

## Revisa ambas partes

Consulta el caso de Laravel para las responsabilidades del servidor y el repositorio del SDK para la integración del navegador. Prueba conjuntamente el renderizado inicial, la hidratación, las asignaciones ausentes y la navegación. Una interfaz consistente es necesaria, pero las conclusiones también dependen de definiciones correctas de eventos y del diseño del experimento.

[Explora el proyecto de experimentación](/es/projects/experimentation/).
