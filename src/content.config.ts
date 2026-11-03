import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const studies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/studies' }),
  schema: z.object({
    locale: z.enum(['en', 'es']),
    studyId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u),
    kind: z.enum(['experience', 'project']),
    order: z.number().int().positive(),
    title: z.string().min(1),
    description: z.string().min(1),
    organization: z.string().min(1),
    role: z.string().min(1),
    period: z.string().min(1),
    tags: z.array(z.string()).min(1),
    result: z.string().min(1),
    resultLabel: z.string().min(1),
    visual: z.enum([
      'performance',
      'platform',
      'gateway',
      'experimentation',
      'secure-keys',
    ]),
    repository: z.url().optional(),
    media: z
      .object({
        src: z.string().startsWith('/'),
        alt: z.string().min(1),
        caption: z.string().min(1),
        source: z.url(),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      })
      .optional(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    locale: z.enum(['en', 'es']),
    noteId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u),
    title: z.string().min(1),
    description: z.string().min(1),
    order: z.number().int().positive(),
    tags: z.array(z.string()).min(1),
  }),
});

export const collections = { studies, notes };
