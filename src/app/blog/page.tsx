import styles from '@/app/ui/Portfolio.module.css';

export const metadata = { title: 'Blog | Agustinus Ardhito' };

export default function BlogPage() {
  return (
    <main className={styles.portfolio}>
      <section className={styles.section}>
        <h1>Blog</h1>
        <p><a className={styles.textLink} href="https://agustinusardhito.wordpress.com/">Read my blog on WordPress →</a></p>
      </section>
    </main>
  );
}
