import Link from 'next/link';
import styles from './Portfolio.module.css';

const links = [
  { title: 'Resume', href: '/resume' },
  { title: 'Blog', href: 'https://agustinusardhito.wordpress.com/' },
  { title: 'Music', href: 'https://soundcloud.com/ardhitooo' },
];

export default function ResponsiveAppBar() {
  return (
    <nav className={styles.navigation} aria-label="Main navigation">
      <div className={styles.navigationInner}>
        <Link className={styles.brand} href="/" aria-label="agusdhito home">agusdhito</Link>
        <div className={styles.navigationLinks}>
          {links.map((link) => (
            <Link key={link.title} href={link.href}>{link.title}</Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
