import Link from "next/link";

import styles from './home.module.css';

export default function Page() {
  return (
    <div id={styles.homePage}>
      <h1>Welcome! Right now its just mediapoint so go ahead and start that controller!</h1>
      <Link href="/controller">Go to controller</Link>
    </div>
  );
}
