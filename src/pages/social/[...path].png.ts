import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import sharp from 'sharp';

interface Props {
  title: string;
  label: string;
}

export const getStaticPaths = (async () => {
  const [notes, studies] = await Promise.all([
    getCollection('notes'),
    getCollection('studies'),
  ]);
  return [
    ...notes.map(({ data }) => ({
      params: { path: `${data.locale}/notes/${data.noteId}` },
      props: {
        title: data.title,
        label:
          data.locale === 'es' ? 'Notas de ingeniería' : 'Engineering notes',
      },
    })),
    ...studies.map(({ data }) => ({
      params: { path: `${data.locale}/studies/${data.studyId}` },
      props: { title: data.title, label: data.organization },
    })),
  ];
}) satisfies GetStaticPaths;

function escapeXml(value: string): string {
  return value.replace(
    /[<>&"']/gu,
    (character) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
      })[character] ?? character,
  );
}

export const GET: APIRoute = async ({ props }) => {
  const { title, label } = props as Props;
  const lines: string[] = [''];
  for (const word of title.split(/\s+/u)) {
    const index = lines.length - 1;
    const current = lines[index] ?? '';
    if (current && `${current} ${word}`.length > 33) {
      lines.push(word);
    } else {
      lines[index] = current ? `${current} ${word}` : word;
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#0b1420"/>
    <rect x="64" y="64" width="56" height="6" rx="3" fill="#9abbff"/>
    <text x="64" y="118" fill="#9abbff" font-family="sans-serif" font-size="24">${escapeXml(label)}</text>
    <text fill="#e6edf6" font-family="sans-serif" font-size="52" font-weight="700">${lines.map((line, index) => `<tspan x="64" y="${215 + index * 68}">${escapeXml(line)}</tspan>`).join('')}</text>
    <path d="M64 522H1136" stroke="#2b3b4e"/>
    <text x="64" y="574" fill="#e6edf6" font-family="sans-serif" font-size="27">Derian Córdoba</text>
    <text x="1136" y="574" text-anchor="end" fill="#a5b2c3" font-family="sans-serif" font-size="21">derian-cordoba.me</text>
  </svg>`;
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
