import React from 'react';

interface ExperienceBoxResumeProps {
  job_title: string;
  company: string;
  date: string;
  logo_url?: string;
  achievements: string[];
}

export default function ExperienceBoxResume({
  job_title,
  company,
  date,
  logo_url,
  achievements
}: ExperienceBoxResumeProps) {
  return (
    <div className="experience-item">
      <div className="experience-header">
        <div className="experience-title-wrapper">
          <div className="company-logo">
            {logo_url ? (
              <img src={logo_url} alt={company} />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="job-title">{job_title}</h3>
            <p className="company">{company}</p>
          </div>
        </div>
        <p className="date">{date}</p>
      </div>
      <ul className="achievements">
        {achievements.map((achievement, index) => (
          <li key={index}>{achievement}</li>
        ))}
      </ul>
    </div>
  );
}
