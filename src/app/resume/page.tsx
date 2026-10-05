'use client';

import siteContent from '@/app/data/site-content.json';
import { renderResume, resumeStyles } from '@/app/data/resume-template.mjs';

export default function ResumePage() {
  return (
    <div className="application-resume">
      <style>{resumeStyles}</style>
      <div className="resume-actions">
        <button onClick={() => window.print()}>Save as PDF</button>
        <a href="/cv.pdf" download>Download CV</a>
      </div>
      {/* The shared renderer escapes every source value, including link attributes. */}
      <div dangerouslySetInnerHTML={{ __html: renderResume(siteContent) }} />
    </div>
  );
}
