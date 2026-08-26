'use client';

import React from 'react';
import './resume.css';
import ExperienceBoxResume from '@/app/ui/ExperienceBoxResume';
import siteContent from '@/app/data/site-content.json';

export default function ResumePage() {
  const { profile, skills, education, keyAchievements, experiences } = siteContent;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="resume-container">
      {/* Print Button - Hidden in print mode */}
      <button
        onClick={handlePrint}
        className="print-button no-print"
        aria-label="Save as PDF"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Save as PDF
      </button>

      <div className="resume-page">
        {/* Header Section */}
        <header className="resume-header">
          <div className="header-content">
            {/* Portrait Photo */}
            <div className="portrait-placeholder">
              <img src={profile.photo} alt={profile.name} />
            </div>
            <div className="header-text">
              <h1 className="name">{profile.name}</h1>
              <p className="title">{profile.title}</p>
              <p className="location">{profile.location}</p>
            </div>
          </div>
        </header>

        {/* Two Column Layout */}
        <div className="resume-content">
          {/* Left Sidebar */}
          <aside className="sidebar">
            {/* Contact Information */}
            <section className="contact-section">
              <h2 className="section-title">CONTACT</h2>
              <div className="contact-item">
                <span className="contact-label">Email:</span>
                <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
              </div>
              <div className="contact-item">
                <span className="contact-label">LinkedIn:</span>
                <a href={profile.contact.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  {profile.contact.linkedinLabel}
                </a>
              </div>
              <div className="contact-item">
                <span className="contact-label">GitHub:</span>
                <a href={profile.contact.githubUrl} target="_blank" rel="noopener noreferrer">
                  {profile.contact.githubLabel}
                </a>
              </div>
              <div className="contact-item">
                <span className="contact-label">Portfolio:</span>
                <a href={profile.contact.portfolioUrl} target="_blank" rel="noopener noreferrer">
                  {profile.contact.portfolioLabel}
                </a>
              </div>
            </section>

            {/* Skills Section */}
            <section className="skills-section">
              <h2 className="section-title">TECHNICAL SKILLS</h2>

              {skills.map((skillGroup) => (
                <div className="skill-category" key={skillGroup.category}>
                  <h3 className="skill-category-title">{skillGroup.category}</h3>
                  <p className="skill-list">{skillGroup.items.join(', ')}</p>
                </div>
              ))}
            </section>

            {/* Education Section */}
            <section className="education-section">
              <h2 className="section-title">EDUCATION</h2>
              {education.map((edu, index) => (
                <div className="education-item" key={index}>
                  <h3 className="degree">{edu.degree}</h3>
                  <p className="institution">{edu.institution}</p>
                  <p className="year">{edu.start} - {edu.end}</p>
                </div>
              ))}
            </section>
          </aside>

          {/* Right Main Content */}
          <main className="main-content">
            {/* Professional Summary */}
            <section className="summary-section">
              <h2 className="section-title">PROFESSIONAL SUMMARY</h2>
              <p className="summary-text">
                {profile.summary}
              </p>
            </section>

            {/* Work Experience */}
            <section className="experience-section">
              <h2 className="section-title">PROFESSIONAL EXPERIENCE</h2>

              {experiences.map((experience) => (
                <ExperienceBoxResume
                  key={experience.id}
                  job_title={experience.job_title}
                  company={experience.company}
                  date={experience.dateLabel}
                  logo_url={experience.logo_url}
                  achievements={experience.achievements}
                />
              ))}
            </section>

            {/* Achievements Section */}
            <section className="achievements-section">
              <h2 className="section-title">KEY ACHIEVEMENTS</h2>
              <ul className="achievements">
                {keyAchievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
