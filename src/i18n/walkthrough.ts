export const walkthroughTranslations = {
  en: {
    authentication: {
      title: 'Authentication failure',
      steps: [
        'GET /reports without x-api-key.',
        'The route requires an API key; the request is rejected.',
        'The upstream is not called. The client receives 401.',
      ],
    },
    timeout: {
      title: 'Upstream timeout',
      steps: [
        'GET /slow is forwarded to the configured upstream.',
        'No response begins within the configured 100 ms.',
        'The upstream connection is aborted. The client receives 504.',
      ],
    },
    circuit: {
      title: 'Open circuit',
      steps: [
        'The /payments circuit is assumed open after its failure threshold is met.',
        'A subsequent request arrives before the 10,000 ms recovery window ends.',
        'The gateway skips the upstream. The client receives 503.',
      ],
    },
  },
  es: {
    authentication: {
      title: 'Fallo de autenticación',
      steps: [
        'GET /reports sin el encabezado x-api-key.',
        'La ruta exige una clave de API; se rechaza la solicitud.',
        'No se llama al servicio de destino. El cliente recibe 401.',
      ],
    },
    timeout: {
      title: 'Tiempo de espera agotado',
      steps: [
        'GET /slow se reenvía al servicio de destino configurado.',
        'La respuesta no comienza dentro de los 100 ms configurados.',
        'Se cancela la conexión al servicio. El cliente recibe 504.',
      ],
    },
    circuit: {
      title: 'Circuito abierto',
      steps: [
        'Se supone que el circuito de /payments ya está abierto tras alcanzar su umbral de fallos.',
        'Llega otra solicitud antes de terminar la ventana de recuperación de 10,000 ms.',
        'El gateway omite la llamada al servicio. El cliente recibe 503.',
      ],
    },
  },
} as const;
