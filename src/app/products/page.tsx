import siteContent from '@/app/data/site-content.json';
import styles from '@/app/ui/Portfolio.module.css';

export const metadata = { title: 'Engineering Work | Agustinus Ardhito' };

export default function WorkPage() {
  return (
    <main className={styles.portfolio}>
      <section className={styles.section}>
        <h1>Selected engineering work</h1>
        <p>Architecture, delivery, and reliability outcomes from my engineering roles.</p>
      </section>
      {[...siteContent.experiences].sort((a, b) => b.start.localeCompare(a.start)).map((role) => (
        <section className={styles.section} key={role.id}>
          <h2>{role.company}</h2>
          <h3>{role.job_title}</h3>
          <p className={styles.date}>{role.dateLabel}</p>
          <p>{role.summary}</p>
          {role.achievements.map((achievement) => <p className={styles.featuredImpact} key={achievement}>{achievement}</p>)}
        </section>
      ))}
    </main>
  );
}
