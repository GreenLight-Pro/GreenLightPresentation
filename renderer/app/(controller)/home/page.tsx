import styles from './home.module.css';
import Link from 'next/link';
import fs from 'fs';

export default function Page() {
  return (
    <div id={styles.homePage}>
      <h1>Olá!</h1>
      <p>Selecione seu projeto abaixo ou crie um novo</p>
      {fs.readdirSync('.').map((project) => {
        return (
          <div key={project}>
            <Link href={`/project/${project}`}>{project}</Link>
          </div>
        );
      })}
      <Link href="/controller">Go to controller</Link>
    </div>
  );
}
