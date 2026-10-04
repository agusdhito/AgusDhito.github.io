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
if (args.some((arg) => arg !== '--pdf')) {
  throw new Error('Usage: npm run resume:technical-lead [-- --pdf]');
}
const { profile, experiences, skills, education } = JSON.parse(
  await readFile(path.join(root, 'src/app/data/site-content.json'), 'utf8'),
);
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));
const link = (url, label) => {
  if (!/^(https:\/\/|mailto:)/i.test(url)) throw new Error(`Unsupported contact URL: ${url}`);
  return `<a href="${escape(url)}">${escape(label)}</a>`;
};
const ordered = [...experiences].sort((a, b) => b.start.localeCompare(a.start));
const date = (value) => {
  if (value === null) return 'Present';
  return new Intl.DateTimeFormat('en-AU', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${value}-01T00:00:00Z`));
};
// Prioritise technical outcomes while keeping each achievement verbatim.
const technicalScore = (text) =>
  /architect|distributed|authentication|database|microservice/i.test(text) ? 3 :
    /reliability|incident|testing|uptime|available/i.test(text) ? 2 : 1;
const experience = (role) => `<article>
  <h3>${escape(role.job_title)}</h3>
  <p class="company">${escape(role.company)} <span class="dates">| ${escape(date(role.start))} – ${escape(date(role.end))}</span></p>
  <p>${escape(role.summary)}</p>
  <ul>${[...role.achievements].sort((a, b) => technicalScore(b) - technicalScore(a))
    .map((item) => `<li>${escape(item)}</li>`).join('')}</ul>
</article>`;
const summary = profile.summary.replace(/^Engineering Manager\b/, 'Hands-on engineering leader');
const technicalSkills = skills.filter((group) => group.category !== 'Languages');
const languages = skills.filter((group) => group.category === 'Languages');
const html = `<!doctype html>
<html lang="en-AU">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(profile.name)} — Technical Lead</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; background: #edf0f3; color: #202a35; font: 10pt/1.4 Arial, Helvetica, sans-serif; }
  main { max-width: 210mm; margin: 24px auto; background: white; padding: 15mm; box-shadow: 0 2px 12px #0001; }
  h1 { margin: 0 0 4px; font-size: 23pt; line-height: 1.15; }
  h2 { margin: 17px 0 9px; padding-bottom: 4px; border-bottom: 1px solid #b7c4d1; color: #204461; font-size: 12pt; }
  h3 { margin: 0; font-size: 11pt; }
  p { margin: 5px 0; }
  a { color: #204461; text-decoration: none; overflow-wrap: anywhere; }
  .target { font-size: 12pt; font-weight: bold; color: #204461; }
  .contact { font-size: 9pt; }
  .company { font-weight: bold; }
  .dates { font-weight: normal; }
  article { margin-bottom: 15px; }
  ul { padding-left: 17px; margin: 6px 0 0; }
  li { margin-bottom: 4px; }
  .skills p { margin: 5px 0; }
  .second-page { margin-top: 24px; }
  button { display: block; margin: 20px auto; padding: 10px 20px; background: #204461; color: white; border: 0; border-radius: 4px; cursor: pointer; }
  @page { size: A4; margin: 15mm; }
  @media print {
    body { background: white; }
    main { max-width: none; margin: 0; padding: 0; box-shadow: none; }
    button { display: none; }
    .second-page { break-before: page; margin-top: 0; }
    h2, h3, .company { break-after: avoid; }
    article > p { break-after: avoid; }
    li, .skills p { break-inside: avoid; }
    p, li { orphans: 2; widows: 2; }
  }
  @media screen and (max-width: 600px) { main { margin: 0; padding: 24px; } h1 { font-size: 20pt; } }
</style></head>
<body>
<button onclick="window.print()">Save as PDF</button>
<main>
  <header>
    <h1>${escape(profile.name)}</h1>
    <p class="target">Technical Lead | Backend &amp; Distributed Systems</p>
    <p>${escape(profile.location)}</p>
    <p class="contact">${link(`mailto:${profile.contact.email}`, profile.contact.email)}<br>
    LinkedIn: ${link(profile.contact.linkedinUrl, profile.contact.linkedinUrl)}<br>
    GitHub: ${link(profile.contact.githubUrl, profile.contact.githubUrl)} · Portfolio: ${link(profile.contact.portfolioUrl, profile.contact.portfolioLabel)}</p>
  </header>
  <section><h2>Professional Summary</h2><p>${escape(summary)}</p></section>
  <section class="skills"><h2>Skills</h2>${technicalSkills.map((group) => `<p><strong>${escape(group.category)}:</strong> ${escape(group.items.join(', '))}</p>`).join('')}</section>
  <section><h2>Experience</h2>${ordered.slice(0, 1).map(experience).join('')}</section>
  <div class="second-page">
    <section><h2>Experience (continued)</h2>${ordered.slice(1).map(experience).join('')}</section>
    <section><h2>Education</h2>${education.map((item) => `<p><strong>${escape(item.degree)}</strong> — ${escape(item.institution)} | ${escape(item.start)} – ${escape(item.end)}</p>`).join('')}</section>
    ${languages.length ? `<section><h2>Languages</h2><p>${escape(languages.flatMap((group) => group.items).join('; '))}</p></section>` : ''}
  </div>
</main></body></html>`;

await mkdir(output, { recursive: true });
const htmlPath = path.join(output, 'technical-lead.html');
await writeFile(htmlPath, html);
console.log(`Generated ${htmlPath}`);

if (args.includes('--pdf')) {
  const candidates = [process.env.CHROME_PATH, 'google-chrome', 'chromium', 'chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, 'Google/Chrome/Application/chrome.exe'),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe')].filter(Boolean);
  const browser = candidates.find((candidate) => spawnSync(candidate, ['--version'], { timeout: 10000 }).status === 0);
  if (!browser) throw new Error('Chrome/Chromium not found. Set CHROME_PATH to its executable, or open the generated HTML and use Save as PDF.');
  const pdfPath = path.join(output, 'technical-lead.pdf');
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
  console.log('Open the HTML in a browser and select Save as PDF (A4, headers/footers off), or run npm run resume:technical-lead:pdf.');
}
