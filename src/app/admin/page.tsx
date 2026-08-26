'use client';

import React, { useState } from 'react';
import './admin.css';
import initialContent from '@/app/data/site-content.json';

// ---- Types (mirrors src/app/data/site-content.json) ----
interface Contact {
  email: string;
  linkedinUrl: string;
  linkedinLabel: string;
  githubUrl: string;
  githubLabel: string;
  portfolioUrl: string;
  portfolioLabel: string;
}
interface Profile {
  name: string;
  title: string;
  location: string;
  photo: string;
  summary: string;
  contact: Contact;
}
interface SkillGroup {
  category: string;
  items: string[];
}
interface Education {
  degree: string;
  institution: string;
  start: string;
  end: string;
}
interface Experience {
  id: string;
  job_title: string;
  company: string;
  logo_url: string;
  start: string;
  end: string | null;
  dateLabel: string;
  summary: string;
  achievements: string[];
}
interface SiteContent {
  profile: Profile;
  skills: SkillGroup[];
  education: Education[];
  keyAchievements: string[];
  experiences: Experience[];
}

function emptyExperience(): Experience {
  return {
    id: `exp-${Math.random().toString(36).slice(2)}`,
    job_title: '',
    company: '',
    logo_url: '',
    start: '',
    end: null,
    dateLabel: '',
    summary: '',
    achievements: [''],
  };
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [content, setContent] = useState<SiteContent>(initialContent as SiteContent);
  const [status, setStatus] = useState<{ kind: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    kind: 'idle',
    message: '',
  });

  async function handleSave() {
    if (!password) {
      setStatus({ kind: 'error', message: 'Enter the admin password to save.' });
      return;
    }
    setStatus({ kind: 'loading', message: 'Saving…' });
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, content }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Save failed (${res.status})`);
      setStatus({
        kind: 'success',
        message: 'Saved to site-content.json. Commit and push to publish it to the live site.',
      });
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Failed to save.' });
    }
  }

  // ---- generic update helpers ----
  const update = (updater: (c: SiteContent) => SiteContent) => setContent((c) => updater(c));

  const updateProfile = (patch: Partial<Profile>) =>
    update((c) => ({ ...c, profile: { ...c.profile, ...patch } }));
  const updateContact = (patch: Partial<Contact>) =>
    update((c) => ({ ...c, profile: { ...c.profile, contact: { ...c.profile.contact, ...patch } } }));

  const updateSkillGroup = (index: number, patch: Partial<SkillGroup>) =>
    update((c) => ({ ...c, skills: c.skills.map((s, i) => (i === index ? { ...s, ...patch } : s)) }));
  const addSkillGroup = () => update((c) => ({ ...c, skills: [...c.skills, { category: '', items: [] }] }));
  const removeSkillGroup = (index: number) =>
    update((c) => ({ ...c, skills: c.skills.filter((_, i) => i !== index) }));

  const updateEducation = (index: number, patch: Partial<Education>) =>
    update((c) => ({ ...c, education: c.education.map((e, i) => (i === index ? { ...e, ...patch } : e)) }));
  const addEducation = () =>
    update((c) => ({ ...c, education: [...c.education, { degree: '', institution: '', start: '', end: '' }] }));
  const removeEducation = (index: number) =>
    update((c) => ({ ...c, education: c.education.filter((_, i) => i !== index) }));

  const updateKeyAchievement = (index: number, value: string) =>
    update((c) => ({ ...c, keyAchievements: c.keyAchievements.map((a, i) => (i === index ? value : a)) }));
  const addKeyAchievement = () => update((c) => ({ ...c, keyAchievements: [...c.keyAchievements, ''] }));
  const removeKeyAchievement = (index: number) =>
    update((c) => ({ ...c, keyAchievements: c.keyAchievements.filter((_, i) => i !== index) }));

  const updateExperience = (index: number, patch: Partial<Experience>) =>
    update((c) => ({ ...c, experiences: c.experiences.map((e, i) => (i === index ? { ...e, ...patch } : e)) }));
  const addExperience = () => update((c) => ({ ...c, experiences: [emptyExperience(), ...c.experiences] }));
  const removeExperience = (index: number) =>
    update((c) => ({ ...c, experiences: c.experiences.filter((_, i) => i !== index) }));
  const moveExperience = (index: number, direction: -1 | 1) =>
    update((c) => {
      const arr = [...c.experiences];
      const target = index + direction;
      if (target < 0 || target >= arr.length) return c;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return { ...c, experiences: arr };
    });
  const updateExperienceAchievement = (expIndex: number, achIndex: number, value: string) =>
    update((c) => ({
      ...c,
      experiences: c.experiences.map((e, i) =>
        i === expIndex ? { ...e, achievements: e.achievements.map((a, j) => (j === achIndex ? value : a)) } : e
      ),
    }));
  const addExperienceAchievement = (expIndex: number) =>
    update((c) => ({
      ...c,
      experiences: c.experiences.map((e, i) => (i === expIndex ? { ...e, achievements: [...e.achievements, ''] } : e)),
    }));
  const removeExperienceAchievement = (expIndex: number, achIndex: number) =>
    update((c) => ({
      ...c,
      experiences: c.experiences.map((e, i) =>
        i === expIndex ? { ...e, achievements: e.achievements.filter((_, j) => j !== achIndex) } : e
      ),
    }));

  return (
    <div className="admin-container">
      <h1 className="admin-title">Site Content Editor</h1>
      <p className="admin-subtitle">
        Local editor — edits are written to <code>src/app/data/site-content.json</code>. Commit and push to
        publish them.
      </p>

      {/* Profile */}
      <section className="admin-card">
        <h2>Profile</h2>
        <div className="admin-row">
          <div className="admin-field">
            <label>Full name</label>
            <input type="text" value={content.profile.name} onChange={(e) => updateProfile({ name: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Title</label>
            <input type="text" value={content.profile.title} onChange={(e) => updateProfile({ title: e.target.value })} />
          </div>
        </div>
        <div className="admin-row">
          <div className="admin-field">
            <label>Location</label>
            <input type="text" value={content.profile.location} onChange={(e) => updateProfile({ location: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Photo path (in /public)</label>
            <input type="text" value={content.profile.photo} onChange={(e) => updateProfile({ photo: e.target.value })} />
          </div>
        </div>
        <div className="admin-field">
          <label>Professional summary</label>
          <textarea value={content.profile.summary} onChange={(e) => updateProfile({ summary: e.target.value })} rows={4} />
        </div>

        <div className="admin-row">
          <div className="admin-field">
            <label>Email</label>
            <input type="email" value={content.profile.contact.email} onChange={(e) => updateContact({ email: e.target.value })} />
          </div>
        </div>
        <div className="admin-row">
          <div className="admin-field">
            <label>LinkedIn URL</label>
            <input type="text" value={content.profile.contact.linkedinUrl} onChange={(e) => updateContact({ linkedinUrl: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>LinkedIn label</label>
            <input type="text" value={content.profile.contact.linkedinLabel} onChange={(e) => updateContact({ linkedinLabel: e.target.value })} />
          </div>
        </div>
        <div className="admin-row">
          <div className="admin-field">
            <label>GitHub URL</label>
            <input type="text" value={content.profile.contact.githubUrl} onChange={(e) => updateContact({ githubUrl: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>GitHub label</label>
            <input type="text" value={content.profile.contact.githubLabel} onChange={(e) => updateContact({ githubLabel: e.target.value })} />
          </div>
        </div>
        <div className="admin-row">
          <div className="admin-field">
            <label>Portfolio URL</label>
            <input type="text" value={content.profile.contact.portfolioUrl} onChange={(e) => updateContact({ portfolioUrl: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Portfolio label</label>
            <input type="text" value={content.profile.contact.portfolioLabel} onChange={(e) => updateContact({ portfolioLabel: e.target.value })} />
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="admin-card">
        <h2>Technical Skills</h2>
        {content.skills.map((group, i) => (
          <div className="admin-entry" key={i}>
            <div className="admin-entry-header">
              <span>Category {i + 1}</span>
              <button className="admin-btn admin-btn-danger admin-btn-small" onClick={() => removeSkillGroup(i)}>Remove</button>
            </div>
            <div className="admin-field">
              <label>Category name</label>
              <input type="text" value={group.category} onChange={(e) => updateSkillGroup(i, { category: e.target.value })} />
            </div>
            <div className="admin-field">
              <label>Items (comma-separated)</label>
              <input
                type="text"
                value={group.items.join(', ')}
                onChange={(e) => updateSkillGroup(i, { items: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
              />
            </div>
          </div>
        ))}
        <button className="admin-btn admin-btn-secondary admin-add-btn" onClick={addSkillGroup}>+ Add skill category</button>
      </section>

      {/* Education */}
      <section className="admin-card">
        <h2>Education</h2>
        {content.education.map((edu, i) => (
          <div className="admin-entry" key={i}>
            <div className="admin-entry-header">
              <span>Entry {i + 1}</span>
              <button className="admin-btn admin-btn-danger admin-btn-small" onClick={() => removeEducation(i)}>Remove</button>
            </div>
            <div className="admin-field">
              <label>Degree</label>
              <input type="text" value={edu.degree} onChange={(e) => updateEducation(i, { degree: e.target.value })} />
            </div>
            <div className="admin-field">
              <label>Institution</label>
              <input type="text" value={edu.institution} onChange={(e) => updateEducation(i, { institution: e.target.value })} />
            </div>
            <div className="admin-row">
              <div className="admin-field">
                <label>Start year</label>
                <input type="text" value={edu.start} onChange={(e) => updateEducation(i, { start: e.target.value })} />
              </div>
              <div className="admin-field">
                <label>End year</label>
                <input type="text" value={edu.end} onChange={(e) => updateEducation(i, { end: e.target.value })} />
              </div>
            </div>
          </div>
        ))}
        <button className="admin-btn admin-btn-secondary admin-add-btn" onClick={addEducation}>+ Add education entry</button>
      </section>

      {/* Key Achievements */}
      <section className="admin-card">
        <h2>Key Achievements</h2>
        {content.keyAchievements.map((achievement, i) => (
          <div className="admin-field" key={i}>
            <label>Achievement {i + 1}</label>
            <div className="admin-row">
              <input type="text" value={achievement} onChange={(e) => updateKeyAchievement(i, e.target.value)} />
              <button className="admin-btn admin-btn-danger admin-btn-small" style={{ flex: '0 0 auto' }} onClick={() => removeKeyAchievement(i)}>Remove</button>
            </div>
          </div>
        ))}
        <button className="admin-btn admin-btn-secondary admin-add-btn" onClick={addKeyAchievement}>+ Add achievement</button>
      </section>

      {/* Experiences */}
      <section className="admin-card">
        <h2>Professional Experience</h2>
        <button className="admin-btn admin-btn-secondary admin-add-btn" style={{ marginBottom: '1rem' }} onClick={addExperience}>+ Add role at top</button>
        {content.experiences.map((exp, i) => (
          <div className="admin-entry" key={exp.id}>
            <div className="admin-entry-header">
              <span>{exp.job_title || 'New role'} {exp.company ? `— ${exp.company}` : ''}</span>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button className="admin-btn admin-btn-secondary admin-btn-small" onClick={() => moveExperience(i, -1)} disabled={i === 0}>↑</button>
                <button className="admin-btn admin-btn-secondary admin-btn-small" onClick={() => moveExperience(i, 1)} disabled={i === content.experiences.length - 1}>↓</button>
                <button className="admin-btn admin-btn-danger admin-btn-small" onClick={() => removeExperience(i)}>Remove</button>
              </div>
            </div>
            <div className="admin-row">
              <div className="admin-field">
                <label>Job title</label>
                <input type="text" value={exp.job_title} onChange={(e) => updateExperience(i, { job_title: e.target.value })} />
              </div>
              <div className="admin-field">
                <label>Company</label>
                <input type="text" value={exp.company} onChange={(e) => updateExperience(i, { company: e.target.value })} />
              </div>
            </div>
            <div className="admin-row">
              <div className="admin-field">
                <label>Logo path (in /public)</label>
                <input type="text" value={exp.logo_url} onChange={(e) => updateExperience(i, { logo_url: e.target.value })} />
              </div>
              <div className="admin-field">
                <label>Date label (shown on site, e.g. &quot;Jan 2021 - Mar 2022&quot;)</label>
                <input type="text" value={exp.dateLabel} onChange={(e) => updateExperience(i, { dateLabel: e.target.value })} />
              </div>
            </div>
            <div className="admin-row">
              <div className="admin-field">
                <label>Start (YYYY-MM)</label>
                <input type="text" value={exp.start} onChange={(e) => updateExperience(i, { start: e.target.value })} />
              </div>
              <div className="admin-field">
                <label>End (YYYY-MM, leave blank if current)</label>
                <input type="text" value={exp.end ?? ''} onChange={(e) => updateExperience(i, { end: e.target.value || null })} />
              </div>
            </div>
            <div className="admin-field">
              <label>Timeline summary (shown on homepage timeline)</label>
              <textarea value={exp.summary} onChange={(e) => updateExperience(i, { summary: e.target.value })} rows={3} />
            </div>
            <div className="admin-field">
              <label>Resume bullet points</label>
              {exp.achievements.map((achievement, j) => (
                <div className="admin-row" key={j} style={{ marginBottom: '0.5rem' }}>
                  <input type="text" value={achievement} onChange={(e) => updateExperienceAchievement(i, j, e.target.value)} />
                  <button className="admin-btn admin-btn-danger admin-btn-small" style={{ flex: '0 0 auto' }} onClick={() => removeExperienceAchievement(i, j)}>Remove</button>
                </div>
              ))}
              <button className="admin-btn admin-btn-secondary admin-btn-small" onClick={() => addExperienceAchievement(i)}>+ Add bullet</button>
            </div>
          </div>
        ))}
      </section>

      <div className="admin-actions">
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ maxWidth: '220px' }}
        />
        <button className="admin-btn admin-btn-primary" onClick={handleSave}>Save changes</button>
        {status.kind !== 'idle' && <span className={`admin-status ${status.kind}`}>{status.message}</span>}
      </div>
    </div>
  );
}
