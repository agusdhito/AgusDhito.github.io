const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));
const link = (url, label) => {
  if (!/^(https:\/\/|mailto:)/i.test(url)) throw new Error(`Unsupported contact URL: ${url}`);
  return `<a href="${escape(url)}">${escape(label)}</a>`;
};
const date = (value) => {
  if (value === null) return 'Present';
  return new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' })
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

export const resumeStyles = `
  .application-resume, .application-resume * { box-sizing: border-box; }
  .application-resume { min-height: 100vh; padding: 20px 0; background: #edf0f3; color: #202a35; font: 10pt/1.4 Arial, Helvetica, sans-serif; }
  .application-resume .resume-sheet { max-width: 210mm; margin: 24px auto; background: white; padding: 15mm; box-shadow: 0 2px 12px #0001; }
  .application-resume h1 { margin: 0 0 4px; font-size: 23pt; line-height: 1.15; }
  .application-resume h2 { margin: 17px 0 9px; padding-bottom: 4px; border-bottom: 1px solid #b7c4d1; color: #204461; font-size: 12pt; }
  .application-resume h3 { margin: 0; font-size: 11pt; }
  .application-resume p { margin: 5px 0; }
  .application-resume a { color: #204461; text-decoration: none; overflow-wrap: anywhere; }
  .application-resume .target { font-size: 12pt; font-weight: bold; color: #204461; }
  .application-resume .contact { font-size: 9pt; }
  .application-resume .company { font-weight: bold; }
  .application-resume .dates { font-weight: normal; }
  .application-resume article { margin-bottom: 15px; }
  .application-resume ul { padding-left: 17px; margin: 6px 0 0; }
  .application-resume li { margin-bottom: 4px; }
  .application-resume .skills p { margin: 5px 0; }
  .application-resume .second-page { margin-top: 24px; }
  .application-resume button { display: block; margin: 20px auto; padding: 10px 20px; background: #204461; color: white; border: 0; border-radius: 4px; cursor: pointer; }
  @page { size: A4; margin: 15mm; }
  @media print {
    html, body { margin: 0 !important; padding: 0 !important; background: white; }
    nav, footer, .resume-actions { display: none !important; }
    .application-resume { min-height: 0; padding: 0; background: white; }
    .application-resume, .application-resume * { font-family: Arial, Helvetica, sans-serif !important; font-variant-ligatures: none; }
    .application-resume .resume-sheet { max-width: none; margin: 0; padding: 0; box-shadow: none; }
    .application-resume button { display: none; }
    .application-resume .second-page { break-before: page; margin-top: 0; }
    .application-resume h2, .application-resume h3, .application-resume .company { break-after: avoid; }
    .application-resume article > p { break-after: avoid; }
    .application-resume li, .application-resume .skills p { break-inside: avoid; }
    .application-resume p, .application-resume li { orphans: 2; widows: 2; }
  }
  @media screen and (max-width: 600px) { .application-resume .resume-sheet { margin: 0; padding: 24px; } .application-resume h1 { font-size: 20pt; } }

  .application-resume p, .application-resume h1, .application-resume h2, .application-resume h3, .application-resume span { font-family: inherit; }
  .application-resume ul { list-style: disc; }
  .application-resume h1, .application-resume h2, .application-resume h3 { font-weight: bold; }
  .resume-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 16px; padding: 0 16px; }
  .application-resume .resume-actions button { margin: 0; font: inherit; }
  .application-resume a:focus-visible, .application-resume button:focus-visible { outline: 3px solid #204461; outline-offset: 4px; }
`;

/**
 * Escapes every content value before producing semantic, selectable resume text.
 * @param {typeof import('./site-content.json')} content
 * @param {boolean} technicalLead
 */
export function renderResume(content, technicalLead = false) {
  const { profile, experiences, skills, education } = content;
  const ordered = [...experiences].sort((a, b) => b.start.localeCompare(a.start));
  const summary = technicalLead ? profile.summary.replace(/^Engineering Manager\b/, 'Hands-on engineering leader') : profile.summary;
  const technicalSkills = skills.filter((group) => group.category !== 'Languages');
  const languages = skills.filter((group) => group.category === 'Languages');
  return `<main class="resume-sheet">
  <header>
    <h1>${escape(profile.name)}</h1>
    <p class="target">${escape(technicalLead ? 'Technical Lead | Backend & Distributed Systems' : profile.title)}</p>
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
</main>`;
}
