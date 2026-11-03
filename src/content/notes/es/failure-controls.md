---
locale: es
noteId: failure-controls
title: 'Los tiempos de espera, reintentos y cortacircuitos tienen funciones distintas.'
description: 'Una forma práctica de razonar sobre los límites de fallo sin multiplicar la carga.'
order: 1
tags: [Resiliencia, TypeScript]
---

## Comienza por el presupuesto de la solicitud

Una dependencia puede devolver un error, responder demasiado tarde o no completar nunca una respuesta. Antes de elegir un control de resiliencia, decide cuánto tiempo puede esperar quien realiza la llamada. Una política útil cabe dentro de ese presupuesto y deja margen para gestionar el resultado.

En el ejemplo de API Gateway, `proxy.timeout` limita la espera hasta que el servicio empieza a responder. No es un plazo general para recibir cada byte de una respuesta transmitida progresivamente. Esta diferencia importa al diseñar conexiones persistentes o descargas grandes.

## Asigna una responsabilidad a cada control

Un tiempo de espera limita una espera individual. Un reintento repite una operación. Un cortacircuitos usa fallos anteriores para decidir si conviene realizar otra llamada. Pueden colaborar, pero no se sustituyen entre sí.

Ante una dependencia lenta, el gateway puede devolver un 504 al agotarse el tiempo configurado. Cuando el circuito está abierto, las siguientes llamadas pueden recibir un 503 sin llegar a la dependencia. Son resultados diferentes: una operación intentada superó su espera permitida, o el gateway rechazó el intento porque consideró que la dependencia no estaba disponible.

## Los reintentos consumen tiempo y capacidad

Si una solicitud tiene poco tiempo disponible, varios intentos completos más sus esperas intermedias pueden superarlo aunque cada tiempo de espera individual parezca razonable. Los intentos adicionales también consumen capacidad precisamente cuando un servicio podría estar sobrecargado.

Antes de reintentar una escritura, comprueba que repetirla sea seguro. Una clave de idempotencia ayuda únicamente si el servicio receptor aplica sus reglas. Un identificador generado por el cliente no evita por sí solo el trabajo duplicado.

## Define qué significa recuperarse

Un circuito abierto debe permitir eventualmente un sondeo controlado. En un despliegue con varios procesos, decidir quién sondea y quién actualiza el estado compartido añade un problema de coordinación. Las instantáneas que conservan la última escritura comparten observaciones, pero pueden permitir transiciones contradictorias.

Por eso un diagrama no demuestra por sí solo una garantía distribuida de resiliencia. Revisa el contrato del almacenamiento, el comportamiento concurrente y las pruebas de integración antes de depender de esa garantía.

## Consulta la implementación

El recorrido del portafolio enlaza ejemplos publicados de rutas y sus pruebas. Cambia una política a la vez, observa la respuesta y prueba tanto el fallo como la recuperación. Estas notas explican decisiones de diseño; no presentan mediciones de producción.

[Explora el recorrido del gateway](/es/projects/api-gateway/#walkthrough).
