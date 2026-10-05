import type { Metadata } from 'next';
import siteContent from '@/app/data/site-content.json';

export const metadata: Metadata = {
  title: `Resume | ${siteContent.profile.name}`,
  description: siteContent.profile.summary,
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
