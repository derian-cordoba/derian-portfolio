import type { Locale } from '@/domain/locale';

const en = {
  hiring: 'Hiring overview',
  hiringTitle: 'A clear view of how I can contribute.',
  hiringDescription:
    'Experience, role fit, and ways of working — in one place.',
  hiringIntro:
    'I build backend systems and full-stack products, with experience modernizing SaaS applications, leading delivery, and creating tools that make engineering work more consistent.',
  fit: 'Where I can contribute',
  roles: [
    'Senior Backend Engineer',
    'Senior Full-Stack Engineer',
    'Technical Lead',
  ],
  strengths: [
    [
      'Backend architecture',
      'Typed APIs, shared policies, and maintainable service boundaries.',
    ],
    [
      'Product modernization',
      'Laravel and TypeScript systems, with attention to performance and incremental delivery.',
    ],
    [
      'Engineering delivery',
      'Technical leadership, testing, and repeatable CI workflows.',
    ],
  ],
  collaboration: 'Working together',
  collaborationBody:
    'Based in León, Nicaragua (UTC−6). Native Spanish and professional English. My background spans hands-on implementation and technical leadership across web, backend, and mobile delivery.',
  preferences:
    'I value clear ownership, small reviewable changes, and explicit tradeoffs. Remote international teams and contractor or nearshore collaboration align with my professional profile.',
  evidence: 'Start with the evidence',
  professional: 'Professional case studies',
  openSource: 'Open-source engineering',
  notes: 'Engineering notes',
  notesTitle: 'Decisions behind the implementation.',
  notesDescription:
    'Practical notes on service reliability, experiments, and the tradeoffs behind software design.',
  readNote: 'Read note',
  backNotes: 'All engineering notes',
  minute: 'min read',
  newSection: 'Keep exploring',
  newSectionTitle: 'The thinking behind the work.',
  hiringCard: 'Review role fit, strengths, and collaboration details.',
  notesCard: 'Explore practical design decisions and their limits.',
  copyEmail: 'Copy email',
  copied: 'Email copied.',
  copyFailed:
    'Could not copy. Select the email address or open your email app.',
  messageTitle: 'Send a short introduction',
  inquiryLabel: 'Let’s talk',
  inquiryIntro:
    'Have a role, a collaboration, or a technical challenge in mind? Share a little context to start the conversation.',
  inquiryTopics: 'Opportunities · Collaboration · Engineering',
  preferEmail: 'Prefer to write directly?',
  allFieldsRequired: 'All fields are required.',
  namePlaceholder: 'Your name',
  emailPlaceholder: 'you@example.com',
  messagePlaceholder:
    'Tell me about your team, your project, or what you’d like to build together…',
  name: 'Name',
  email: 'Email',
  message: 'What would you like to discuss?',
  send: 'Send message',
  privacy:
    'Your name, email, and message are processed by Netlify Forms to deliver your inquiry. Please avoid confidential information.',
  thanksTitle: 'Thanks for reaching out.',
  thanksBody:
    'Your message has been submitted. You can also reach me directly by email.',
  home: 'Back to the portfolio',
  walkthrough: 'Explore the system',
  walkthroughIntro:
    'Follow three documented failure paths. These are illustrative traces based on repository examples, not requests to a running gateway.',
  requestPath: 'Request path',
  path: ['Client', 'Route policies', 'Upstream service', 'Client response'],
  pathBody:
    'The selected route applies its policies before proxying. Authentication can stop the request at the boundary; a timeout can terminate an upstream request; an open circuit avoids calling the failing service.',
  configuration: 'Published route configuration',
  trace: 'Illustrative trace',
  source: 'Inspect source',
  tests: 'Inspect tests',
  decisions: 'Architecture decisions',
  decisionItems: [
    [
      'Validated configuration',
      'A typed route contract centralizes policies. The alternative is hand-written middleware per service, which offers flexibility but duplicates validation and policy wiring. Configuration still needs review and testing.',
    ],
    [
      'Separate failure controls',
      'Timeouts bound waiting, while circuit breakers stop repeated calls to an unhealthy dependency. Retries are a separate choice: enabling them indiscriminately can amplify load or duplicate writes.',
    ],
  ],
  limits: 'Limits to keep in view',
  limitsBody:
    'These traces omit scheduling, concurrency, and recovery probes. The published shared circuit-breaker snapshots use last-write-wins semantics; shared visibility is not an atomic distributed state machine. No production throughput or adoption is implied.',
} as const;

type Copy = {
  readonly [K in keyof typeof en]: (typeof en)[K] extends string
    ? string
    : readonly (string | readonly string[])[];
};
const es = {
  hiring: 'Perfil para contratación',
  hiringTitle: 'Una visión clara de cómo puedo contribuir.',
  hiringDescription:
    'Experiencia, afinidad de roles y forma de trabajar en un solo lugar.',
  hiringIntro:
    'Desarrollo sistemas de backend y productos full-stack, con experiencia modernizando aplicaciones SaaS, liderando entregas y creando herramientas que hacen más consistente el trabajo de ingeniería.',
  fit: 'Dónde puedo contribuir',
  roles: [
    'Ingeniero de backend sénior',
    'Ingeniero full-stack sénior',
    'Líder técnico',
  ],
  strengths: [
    [
      'Arquitectura de backend',
      'API tipadas, políticas compartidas y límites de servicios mantenibles.',
    ],
    [
      'Modernización de productos',
      'Sistemas Laravel y TypeScript, con atención al rendimiento y las entregas incrementales.',
    ],
    [
      'Entrega de software',
      'Liderazgo técnico, pruebas y procesos repetibles de integración continua.',
    ],
  ],
  collaboration: 'Cómo podemos colaborar',
  collaborationBody:
    'Resido en León, Nicaragua (UTC−6). Español nativo e inglés profesional. Mi trayectoria combina implementación y liderazgo técnico en proyectos web, de backend y móviles.',
  preferences:
    'Valoro las responsabilidades claras, los cambios pequeños y revisables y las decisiones explícitas. Los equipos internacionales remotos y la colaboración por contrato o nearshore se alinean con mi perfil profesional.',
  evidence: 'Comienza por la evidencia',
  professional: 'Casos de experiencia profesional',
  openSource: 'Ingeniería de código abierto',
  notes: 'Notas de ingeniería',
  notesTitle: 'Las decisiones detrás de la implementación.',
  notesDescription:
    'Notas prácticas sobre resiliencia de servicios, experimentos y decisiones de diseño de software.',
  readNote: 'Leer nota',
  backNotes: 'Todas las notas de ingeniería',
  minute: 'min de lectura',
  newSection: 'Sigue explorando',
  newSectionTitle: 'El razonamiento detrás del trabajo.',
  hiringCard:
    'Consulta la afinidad de roles, fortalezas y detalles de colaboración.',
  notesCard: 'Explora decisiones prácticas de diseño y sus límites.',
  copyEmail: 'Copiar correo',
  copied: 'Correo copiado.',
  copyFailed:
    'No se pudo copiar. Selecciona la dirección o abre tu aplicación de correo.',
  messageTitle: 'Envíame una breve presentación',
  inquiryLabel: 'Conversemos',
  inquiryIntro:
    '¿Tienes una oportunidad, una colaboración o un reto técnico en mente? Comparte un poco de contexto para comenzar la conversación.',
  inquiryTopics: 'Oportunidades · Colaboración · Ingeniería',
  preferEmail: '¿Prefieres escribirme directamente?',
  allFieldsRequired: 'Todos los campos son obligatorios.',
  namePlaceholder: 'Tu nombre',
  emailPlaceholder: 'tu@ejemplo.com',
  messagePlaceholder:
    'Cuéntame sobre tu equipo, tu proyecto o lo que te gustaría construir juntos…',
  name: 'Nombre',
  email: 'Correo electrónico',
  message: '¿Sobre qué te gustaría conversar?',
  send: 'Enviar mensaje',
  privacy:
    'Netlify Forms procesa tu nombre, correo y mensaje para entregar tu consulta. Evita incluir información confidencial.',
  thanksTitle: 'Gracias por contactarme.',
  thanksBody:
    'Tu mensaje se ha enviado. También puedes escribirme directamente por correo.',
  home: 'Volver al portafolio',
  walkthrough: 'Explora el sistema',
  walkthroughIntro:
    'Sigue tres rutas de fallo documentadas. Son trazas ilustrativas basadas en ejemplos del repositorio; no son solicitudes a un gateway en ejecución.',
  requestPath: 'Recorrido de la solicitud',
  path: [
    'Cliente',
    'Políticas de la ruta',
    'Servicio de destino',
    'Respuesta al cliente',
  ],
  pathBody:
    'La ruta seleccionada aplica sus políticas antes de reenviar. La autenticación puede detener la solicitud en el límite; un tiempo de espera puede cancelar una solicitud al servicio; un circuito abierto evita llamar al servicio que falla.',
  configuration: 'Configuración publicada de la ruta',
  trace: 'Traza ilustrativa',
  source: 'Consultar código',
  tests: 'Consultar pruebas',
  decisions: 'Decisiones de arquitectura',
  decisionItems: [
    [
      'Configuración validada',
      'Un contrato de rutas tipado centraliza las políticas. La alternativa es escribir middleware en cada servicio, lo que ofrece flexibilidad pero duplica validaciones y conexiones entre políticas. La configuración también requiere revisión y pruebas.',
    ],
    [
      'Controles de fallo separados',
      'Los tiempos de espera limitan la espera; los cortacircuitos detienen llamadas repetidas a una dependencia con fallos. Los reintentos son otra decisión: habilitarlos indiscriminadamente puede amplificar la carga o duplicar escrituras.',
    ],
  ],
  limits: 'Límites que conviene tener presentes',
  limitsBody:
    'Estas trazas omiten la planificación, la concurrencia y los sondeos de recuperación. Las instantáneas compartidas del cortacircuitos publicado usan la última escritura recibida; compartir visibilidad no equivale a una máquina de estados distribuida atómica. No se afirma capacidad ni adopción en producción.',
} as const satisfies Copy;

export function getFeatureCopy(locale: Locale) {
  return locale === 'es' ? es : en;
}
