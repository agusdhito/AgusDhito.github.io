import { renderResume, resumeStyles } from '../src/app/data/resume-template.mjs';
import { readFile, mkdir, mkdtemp, rm, stat } from 'node:fs/promises';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';

// Read the source on every run so application documents follow content edits.
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'generated-resumes');
const args = process.argv.slice(2);
const general = args.includes('--general');
const publish = args.includes('--public');
if (publish && (!general || !args.includes('--pdf'))) throw new Error('--public requires --general --pdf');
if (args.some((arg) => !['--pdf', '--general', '--public'].includes(arg))) {
  throw new Error('Usage: node scripts/generate-technical-lead-resume.mjs [--pdf] [--general] [--public]');
}
const content = JSON.parse(await readFile(path.join(root, 'src/app/data/site-content.json'), 'utf8'));
const title = general ? 'Resume' : 'Technical Lead';
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${content.profile.name.replace(/[&<>"']/g, '')} — ${title}</title>
<style>body { margin: 0; } ${resumeStyles}</style></head>
<body><div class="application-resume"><div class="resume-actions"><button onclick="window.print()">Save as PDF</button></div>${renderResume(content, !general)}</div></body></html>`;
await mkdir(output, { recursive: true });
const name = general ? 'resume' : 'technical-lead';
const htmlPath = path.join(output, `${name}.html`);
await writeFile(htmlPath, html);
console.log(`Generated ${htmlPath}`);

if (args.includes('--pdf')) {
  const candidates = [process.env.CHROME_PATH, 'google-chrome', 'chromium', 'chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, 'Google/Chrome/Application/chrome.exe'),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe')].filter(Boolean);
  const browser = candidates.find((candidate) => spawnSync(candidate, ['--version'], { timeout: 10000 }).status === 0);
  if (!browser) throw new Error('Chrome/Chromium not found. Set CHROME_PATH to its executable, or open the generated HTML and use Save as PDF.');
  const pdfPath = publish ? path.join(root, 'public/cv.pdf') : path.join(output, `${name}.pdf`);
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'technical-lead-resume-'));
  const temporaryPdf = path.join(temporary, 'resume.pdf');
  try {
    const result = spawnSync(browser, ['--headless', '--disable-gpu', '--no-pdf-header-footer',
      `--user-data-dir=${path.join(temporary, 'browser')}`, `--print-to-pdf=${temporaryPdf}`,
      pathToFileURL(htmlPath).href], { encoding: 'utf8', timeout: 60000 });
    if (result.status !== 0 || !(await stat(temporaryPdf).catch(() => null))?.size) {
      throw new Error(`PDF export failed: ${result.error?.message || result.stderr || `exit ${result.status}`}`);
    }
    await writeFile(pdfPath, await readFile(temporaryPdf));
    console.log(`Generated ${pdfPath}`);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
} else {
  console.log(`Open the HTML in a browser and select Save as PDF (A4, headers/footers off), or run npm run ${general ? 'resume:pdf' : 'resume:technical-lead:pdf'}.`);
}
