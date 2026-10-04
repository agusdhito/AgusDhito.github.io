import Link from 'next/link';
import siteContent from '@/app/data/site-content.json';
import styles from './Portfolio.module.css';

type Experience = (typeof siteContent.experiences)[number];

function ExperienceEntry({ experience }: { experience: Experience }) {
  return (
    <article className={styles.experience}>
      <div className={styles.experienceHeader}>
        <div>
          <h3>{experience.job_title}</h3>
          <p className={styles.company}>{experience.company}</p>
        </div>
        <p className={styles.date}>{experience.dateLabel}</p>
      </div>
      <p>{experience.summary}</p>
      <details className={styles.details}>
        <summary>Achievements</summary>
        <ul>
          {experience.achievements.map((achievement) => (
            <li key={achievement}>{achievement}</li>
          ))}
        </ul>
      </details>
    </article>
  );
}

export default function Landing() {
  const { profile, experiences, skills, keyAchievements, education } = siteContent;

  return (
    <main className={styles.portfolio}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Software engineering · Leadership · System Design</p>
          <h1>{profile.name}</h1>
          <p className={styles.role}>{profile.title}</p>
          <p className={styles.location}>{profile.location}</p>
          <div className={styles.actions}>
            <Link className={styles.primaryLink} href="/resume">View resume <span aria-hidden="true">↗</span></Link>
            <a className={styles.secondaryLink} href={`mailto:${profile.contact.email}`}>Get in touch</a>
          </div>
        </div>
        <img className={styles.portrait} src="/landing-new.webp" alt={`${profile.name} outdoors beneath autumn trees`} width={853} height={1280} />
      </header>

      <section className={styles.section} aria-labelledby="about-title">
        <h2 id="about-title">About</h2>
        <p className={styles.summary}>{profile.summary}</p>
      </section>

      <section className={styles.section} aria-labelledby="impact-title">
        <h2 id="impact-title">Selected impact</h2>
        <ul className={styles.impactList}>
          {keyAchievements.map((achievement) => (
            <li key={achievement}>{achievement}</li>
          ))}
        </ul>
      </section>

      <div className={styles.contentGrid}>
        <section className={styles.section} aria-labelledby="experience-title">
          <h2 id="experience-title">Experience</h2>
          {experiences.map((experience) => (
            <ExperienceEntry key={experience.id} experience={experience} />
          ))}
          <Link className={styles.textLink} href="/resume">View full resume <span aria-hidden="true">→</span></Link>
        </section>
        <aside className={styles.sidebar}>
          <section className={styles.section} aria-labelledby="skills-title">
            <h2 id="skills-title">Skills</h2>
            {skills.map((group) => (
              <div className={styles.skillGroup} key={group.category}>
                <h3>{group.category}</h3>
                <p>{group.items.join(', ')}</p>
              </div>
            ))}
          </section>
          <section className={styles.section} aria-labelledby="education-title">
            <h2 id="education-title">Education</h2>
            {education.map((item) => (
              <div className={styles.skillGroup} key={`${item.institution}-${item.degree}`}>
                <h3>{item.degree}</h3>
                <p>{item.institution}</p>
                <p>{item.start} – {item.end}</p>
              </div>
            ))}
          </section>
        </aside>
      </div>

      <section className={styles.contact} aria-labelledby="contact-title">
        <h2 id="contact-title">Let’s connect</h2>
        <a className={styles.textLink} href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
        <div className={styles.socialLinks}>
          <a href={profile.contact.githubUrl}>GitHub <span aria-hidden="true">↗</span></a>
          <a href={profile.contact.linkedinUrl}>LinkedIn <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </main>
  );
}
