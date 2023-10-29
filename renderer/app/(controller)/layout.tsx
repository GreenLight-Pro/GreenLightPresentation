import React from 'react';
import Header from '../components/header/header';

import styles from './general.module.css';

export default function Layout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <>
      <Header />
      <div id={styles.controlContainer}>
        {children}
      </div>
    </>
  );
}
