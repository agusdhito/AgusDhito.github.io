import siteContent from '@/app/data/site-content.json';
import styles from './Portfolio.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <p>© {new Date().getFullYear()} {siteContent.profile.name}</p>
        <p>Software engineering & technical leadership</p>
      </div>
    </footer>
  );
}
