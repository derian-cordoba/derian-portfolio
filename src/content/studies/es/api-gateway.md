---
locale: es
studyId: api-gateway
kind: project
order: 3
title: La puerta de entrada a tus servicios.
description: Un gateway de API configurable que reúne enrutamiento, resiliencia y observabilidad.
organization: Proyecto independiente de código abierto
role: Autor del proyecto
period: Desarrollo de código abierto
tags: [TypeScript, Node.js, Next.js]
result: Enrutar. Proteger. Observar.
resultLabel: gestión del tráfico mediante configuración
visual: gateway
repository: https://github.com/derian-cordoba/api-gateway
---

## El problema

Las aplicaciones que se comunican con varios servicios necesitan repetidamente enrutamiento, autenticación, límites de tráfico y gestión de fallos. Implementar estas políticas por separado puede generar comportamientos inconsistentes y trabajo duplicado.

Este proyecto explora un punto de entrada compartido con configuración tipada y validada, además de herramientas operativas.

## El sistema

El gateway dirige solicitudes HTTP a los servicios de destino. Sus funciones documentadas incluyen autenticación y límites de solicitudes por ruta, cortacircuitos, balanceo de carga, tiempos de espera, políticas de reintentos, caché, proxy de WebSocket y métricas de Prometheus.

Un panel de Next.js permite configurar el sistema visualmente, mientras que una herramienta de línea de comandos permite gestionar la configuración e importar y exportar OpenAPI.

## Decisiones y compromisos

**La configuración como contrato.** Las rutas se validan antes de registrarse, de modo que una configuración incorrecta se detecta explícitamente durante el arranque.

**Políticas en un límite compartido.** La autenticación, el control de tráfico y el seguimiento de solicitudes pueden aplicarse de forma consistente antes de llegar a los servicios de la aplicación.

**El comportamiento operativo forma parte de la API.** Un tiempo de espera agotado, un circuito abierto y un fallo de autenticación tienen significados distintos. Necesitan respuestas predecibles y registros útiles.

**El estado distribuido necesita límites explícitos.** El repositorio documenta tanto el estado local como los almacenes compartidos inyectables, incluidas las limitaciones de las instantáneas del cortacircuitos cuya última escritura prevalece. Compartir visibilidad no implica actualizaciones atómicas entre procesos.

## Explorar la ruta de fallo

El ejemplo interactivo de esta página ilustra un circuito disponible y uno abierto. Es una simulación simplificada: no ejecuta el gateway ni modela sus umbrales de fallo o temporizadores de recuperación.

## Evidencia y siguientes pasos

El repositorio público incluye documentación de arquitectura, ejemplos ejecutables y comandos de pruebas. Son el punto de partida para inspeccionar la implementación. Este portafolio no afirma cifras verificadas de forma independiente sobre capacidad de procesamiento, disponibilidad o adopción en producción.
