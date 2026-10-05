# Resume generation

All resume views use `src/app/data/resume-template.mjs` and read career facts from `src/app/data/site-content.json`. The website `/resume` and public CV use the Engineering Manager heading. The Technical Lead variant changes the heading and summary opening while retaining the same employers, actual job titles, metrics, skills, and education.

| Command | Output |
| --- | --- |
| `npm run resume` | `generated-resumes/resume.html` |
| `npm run resume:pdf` | General HTML and refreshed `public/cv.pdf` |
| `npm run resume:technical-lead` | `generated-resumes/technical-lead.html` |
| `npm run resume:technical-lead:pdf` | Technical Lead HTML and PDF in `generated-resumes/` |

PDF commands use an existing Chrome or Chromium installation. Set `CHROME_PATH` to the browser executable if it is not detected. No npm dependencies, Next.js server, or online font downloads are needed. Without Chrome, generate HTML and use its **Save as PDF** button: A4 paper, 100% scale, browser headers/footers off.

`npm run build` regenerates `public/cv.pdf` before building the site, so the deployed download follows the current source content. Chrome/Chromium must be available for the build, including in CI. Commit the updated source and public CV together when editing content. The GitHub Pages workflow runs this build with `STATIC_EXPORT=true`; for equivalent local verification, run `STATIC_EXPORT=true npm run build`. This emits the static site to `out/`. Normal builds retain the local server configuration for development.

Local variants in `generated-resumes/` are gitignored and are not deployed. The public `/cv.pdf` is linked from the homepage and `/resume`.

The layout uses selectable text, a single reading column, standard section headings, portfolio links, Skills before Experience, and an A4 page break after the most recent role. Every role appears in reverse chronological order, with architecture and reliability achievements prioritised. No work-rights or sponsorship claim is assumed. Review pagination after substantial content changes.
