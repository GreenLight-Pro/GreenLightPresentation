import React from 'react';
import Header from '../components/header/header';

import styles from './general.module.css';
import CloseAppHandler from './closeAppHandler';

export default function Layout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <>
      <Header />
      <CloseAppHandler />
      <div id={styles.controlContainer}>
        {children}
      </div>
    </>
  );
}
