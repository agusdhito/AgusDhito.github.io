'use client';

import React from 'react';
import './resume.css';
import ExperienceBoxResume from '@/app/ui/ExperienceBoxResume';
import experienceData from '@/app/data/experience_resume.json';

export default function ResumePage() {
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
              <img src="/self-formal.png" alt="Agustinus Ardhito Vedoputro" />
            </div>
            <div className="header-text">
              <h1 className="name">Agustinus Ardhito Vedoputro</h1>
              <p className="title">Engineering Manager</p>
              <p className="location">Jakarta, Indonesia</p>
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
                <a href="mailto:agusdhito@gmail.com">agusdhito@gmail.com</a>
              </div>
              <div className="contact-item">
                <span className="contact-label">LinkedIn:</span>
                <a href="https://www.linkedin.com/in/agustinus-ardhito/" target="_blank" rel="noopener noreferrer">
                  /in/agusdhito
                </a>
              </div>
              <div className="contact-item">
                <span className="contact-label">GitHub:</span>
                <a href="https://github.com/agusdhito" target="_blank" rel="noopener noreferrer">
                  /agusdhito
                </a>
              </div>
              <div className="contact-item">
                <span className="contact-label">Portfolio:</span>
                <a href="https://agusdhito.github.io" target="_blank" rel="noopener noreferrer">
                  agusdhito.github.io
                </a>
              </div>
            </section>

            {/* Skills Section */}
            <section className="skills-section">
              <h2 className="section-title">TECHNICAL SKILLS</h2>

              <div className="skill-category">
                <h3 className="skill-category-title">Languages</h3>
                <p className="skill-list">Go, Ruby, Java, PHP, TypeScript, JavaScript, Python</p>
              </div>

              <div className="skill-category">
                <h3 className="skill-category-title">Frameworks</h3>
                <p className="skill-list">Ruby on Rails, React, Next.js, PHP Yii</p>
              </div>

              <div className="skill-category">
                <h3 className="skill-category-title">Databases</h3>
                <p className="skill-list">PostgreSQL, MySQL, Redis, MongoDB, Cassandra, ELK</p>
              </div>

              <div className="skill-category">
                <h3 className="skill-category-title">DevOps & Tools</h3>
                <p className="skill-list">Docker, Kubernetes, GCP, Git, CI/CD</p>
              </div>

              <div className="skill-category">
                <h3 className="skill-category-title">Leadership</h3>
                <p className="skill-list">Team Management, Agile/Scrum, Technical Mentoring, System Design</p>
              </div>
            </section>

            {/* Education Section */}
            <section className="education-section">
              <h2 className="section-title">EDUCATION</h2>
              <div className="education-item">
                <h3 className="degree">Bachelor of Computer Science</h3>
                <p className="institution">University of Indonesia</p>
                <p className="year">2013 - 2018</p>
              </div>
            </section>
          </aside>

          {/* Right Main Content */}
          <main className="main-content">
            {/* Professional Summary */}
            <section className="summary-section">
              <h2 className="section-title">PROFESSIONAL SUMMARY</h2>
              <p className="summary-text">
                Experienced Engineering Manager with 7+ years in software development and 3+ years in leadership roles.
                Proven track record of leading high-performing engineering teams, scaling systems to serve millions of users,
                and driving technical excellence. Expertise in backend systems, microservices architecture, and building
                robust, scalable platforms for mission-critical applications.
              </p>
            </section>

            {/* Work Experience */}
            <section className="experience-section">
              <h2 className="section-title">PROFESSIONAL EXPERIENCE</h2>

              {experienceData.map((experience, index) => (
                <ExperienceBoxResume
                  key={index}
                  job_title={experience.job_title}
                  company={experience.company}
                  date={experience.date}
                  logo_url={experience.logo_url}
                  achievements={experience.achievements}
                />
              ))}
            </section>

            {/* Achievements Section */}
            <section className="achievements-section">
              <h2 className="section-title">KEY ACHIEVEMENTS</h2>
              <ul className="achievements">
                <li>Successfully scaled systems to support 5+ million daily active users with 99.9% uptime</li>
                <li>Led migration of monolithic application to microservices architecture, improving performance by 90%</li>
                <li>Recognized for excellence in mentoring 8-10 software engineers in technical leadership and team development</li>
              </ul>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
