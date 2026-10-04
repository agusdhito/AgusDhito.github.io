# Technical Lead resume

Run `npm run resume:technical-lead` to generate `generated-resumes/technical-lead.html`.
Open that file in a browser and use **Save as PDF** with A4 paper, 100% scale, and browser headers/footers disabled.

Run `npm run resume:technical-lead:pdf` to generate both HTML and PDF automatically using an existing Chrome or Chromium installation. Set `CHROME_PATH` to the browser executable if it is not detected.

Both commands work without a Next.js server or new npm dependencies. Outputs are local, gitignored application documents and are not deployed. The existing resume and `public/cv.pdf` are unchanged.

Every run reads `src/app/data/site-content.json`. The variant preserves employer names, actual job titles, metrics, contact details, location, skills, and education, sorts roles in reverse chronological order, and prioritises architecture and reliability achievements. The target-role heading is specific to this variant. No work-rights or sponsorship claim is assumed. Update the source content and rerun whenever your experience changes.

The layout uses selectable text, a single reading column, standard section headings, portfolio links, Skills before Experience, and an A4 page break after the most recent role. Review pagination after substantial content changes.
