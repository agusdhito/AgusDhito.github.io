# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio/resume site for Agustinus Ardhito, built with Next.js 15 (App Router) and deployed as a **static export** to GitHub Pages at `AgusDhito.github.io`. There is no runtime backend on the deployed site — it is fully static HTML.

## Purpose & Positioning

This site is a place to store and display Agustinus Ardhito's portfolio.
Its owner is an **Engineering Manager who is still hands-on**, so content and
design should reflect both people/delivery leadership and technical depth.

Career context (informs tone and emphasis, not the site's stated purpose):
markets of interest are **Singapore, Netherlands, Japan, and wider SEA.**
- English-first; concise, metric-driven impact statements (led team of N,
  reduced X by Y%, scope/scale numbers).
- Surface seniority signals relevant to work-visa eligibility.
- Keep claims verifiable and specific; avoid inflated titles.

When editing `site-content.json`, write to this frame.

## Quality Bar (design + review)

Output must pass both automated screening and human review in the target markets.

Human review (recruiters/hiring managers in SG/NL/JP/SEA):
- Clean, professional, uncluttered visual design; consistent spacing, type
  scale, and alignment. Restrained color; readable contrast.
- Scannable in seconds: clear hierarchy, role → company → dates → impact.
- Reverse-chronological experience; each role leads with outcomes, not duties.
- No typos, consistent tense, consistent date formats.

AI / ATS parsing (the `/resume` page and `cv.pdf`):
- Keep text as real, selectable text — not baked into images. Logos/photos may
  be images; resume content must not be.
- Semantic, linear document structure with standard section headings
  (Experience, Skills, Education) so parsers extract fields correctly.
- Include role-relevant keywords naturally (leadership + the technical stack).
- The printable `/resume` view and any exported `cv.pdf` must stay in sync with
  `site-content.json`; don't let the PDF drift from the live content.

## Constraints

- **Do not add npm dependencies** (or external services/CDNs) without explicit
  approval first. Prefer what is already in the stack: Next.js, MUI, Tailwind v4,
  Emotion. Propose, don't install.
- The site must remain a static export deployable to GitHub Pages — no feature
  that requires a running server in production.

## Cover Letters

Cover letters are drafted from `cover-letters/template.html` (gitignored, never
deployed). One file per application; export to PDF via the browser Print button.

When drafting a letter, follow these rules:
- **Length: 2-3 short paragraphs, ≤ 200 words, always ≤ 1 page.** Use 2 when the
  JD is thin; use 3 when there's a strong metric worth featuring. Do not pad to
  four.
- **Structure:** (1) role + a specific hook on why this company, and the most
  relevant proof — leadership scope and hands-on depth mapped to their stated
  needs; (2) one concrete achievement with a real number, tied to the role
  (fold into para 1 if only using two paragraphs); (3) motivation for the
  company/market, relocation note, and a call to action.
- **Natural, not AI-boilerplate.** Ban: "I am writing to express", "perfect
  fit", "passionate", "team player", "proven track record", "fast-paced
  environment", "I believe". Vary sentence length; write like a senior EM speaks.
- **Impact & motivation over duties.** Every claim should map to something the
  company needs (from the JD) or something the candidate genuinely wants.
- **Tailor to the JD:** mirror the role's language and top 2-3 requirements.
- **Facts must match `site-content.json`.** No invented metrics, titles, or
  employers. If a needed fact or motivation is missing, ask the user — don't
  fabricate.
- **Market tone:** SG/NL — concise, direct, metric-led. JP (international track)
  — respectful, specific, less self-promotional. Keep English professional.

## Commands

- `npm run dev` — local dev server (Turbopack) at http://localhost:3000
- `npm run build` — production build; static HTML is emitted to `./out` (the folder GitHub Pages serves)
- `npm run start` — serve the production build
- `npm run lint` — Next.js ESLint

There is no test suite in this repo.

## Architecture

### Content is data-driven from a single JSON file

`src/app/data/site-content.json` is the single source of truth for profile, skills, education, key achievements, and work experiences. Three consumers read it directly via `import siteContent from '@/app/data/site-content.json'`:

- `src/app/ui/Landing.tsx` — homepage (rendered by `src/app/page.tsx`)
- `src/app/resume/page.tsx` — printable resume view (uses `window.print()` for PDF export)
- `src/app/admin/page.tsx` — the editor UI

The `SiteContent` TypeScript shape is **redeclared** at the top of `admin/page.tsx`; when changing the JSON schema, keep that interface (and the consuming components) in sync — there is no shared type module.

### The `/admin` editor is local-dev-only

`/admin` (`src/app/admin/page.tsx`) is a client-side form that POSTs to `/api/admin/save` (`src/app/api/admin/save/route.ts`), which writes edits back to `site-content.json` on disk. This only works while `npm run dev` is running:

- The API route reads `ADMIN_PASSWORD` from `.env.local` (server-side only, never bundled to the browser). Set this locally to use the editor.
- Editing the site is a two-step flow: save via `/admin` → **commit and push** the changed `site-content.json`. The live site does not persist edits; the JSON in git is what deploys.
- Note: the `route.ts` header comment references a build step that strips this route for production, but the actual workflow does not contain it. The route simply has no effect once statically exported (no server), so it is harmless but non-functional on GitHub Pages.

### Deployment

`.github/workflows/nextjs.yml` builds on every push to `main` and deploys `./out` to GitHub Pages. Static export is enabled by the `actions/configure-pages` step (`static_site_generator: next`), which injects the export config and `basePath` at build time — **not** by `next.config.ts` (where `output: 'export'` is left commented out). Do not rely on local `next build` producing `./out` unless that config is uncommented.

### Styling & assets

- Tailwind CSS v4 (via `@tailwindcss/postcss`) plus MUI (`@mui/material`, Emotion) plus per-page plain CSS (`admin/admin.css`, `resume/resume.css`).
- Images and logos live in `/public` and are referenced by path from `site-content.json` (e.g. `logo_url`, `profile.photo`). Because the deployed site is a static export, `next/image` optimization is disabled by GitHub Pages config.

### Legacy / ignore

- `_to_delete/` holds an older version of the site (including a Cloudflare worker and prior `src_app_*` copies). It is not part of the build — do not modify it unless explicitly asked.
- Root-level `index.html`, `_config.yml`, and `README.md` are leftovers from the earlier Jekyll-based GitHub Pages setup and are not used by the Next.js build.
