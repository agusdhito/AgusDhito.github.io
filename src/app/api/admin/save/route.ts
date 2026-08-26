import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Local-only save endpoint for the /admin content editor.
 *
 * This route only exists while a Next.js server is running (i.e. `npm run dev`).
 * The deployed GitHub Pages site is a static export with no server, so this
 * endpoint is stripped before the production build — see the "Remove local-only
 * API routes" step in .github/workflows/nextjs.yml.
 *
 * ADMIN_PASSWORD is read from .env.local, server-side only. It is never sent to
 * or readable from the browser bundle.
 */

const CONTENT_PATH = path.join(process.cwd(), 'src', 'app', 'data', 'site-content.json');

export async function POST(request: Request) {
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD is not set. Add it to .env.local and restart the dev server.' },
      { status: 500 }
    );
  }

  let body: { password?: string; content?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.password || body.password !== expected) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }

  if (!body.content || typeof body.content !== 'object') {
    return NextResponse.json({ error: 'Missing or invalid content' }, { status: 400 });
  }

  try {
    await fs.writeFile(CONTENT_PATH, JSON.stringify(body.content, null, 2) + '\n', 'utf-8');
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to write file' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
