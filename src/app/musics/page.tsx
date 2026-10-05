import styles from '@/app/ui/Portfolio.module.css';

export const metadata = { title: 'Music | Agustinus Ardhito' };

export default function MusicPage() {
  return (
    <main className={styles.portfolio}>
      <section className={styles.section}>
        <h1>Music</h1>
        <p><a className={styles.textLink} href="https://soundcloud.com/ardhitooo">Listen on SoundCloud →</a></p>
      </section>
    </main>
  );
}
