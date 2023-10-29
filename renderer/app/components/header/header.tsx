'use client';

import React from 'react';
import styles from './header.module.css';

export default function Header(): React.ReactElement {
  return (
    <div id={styles.headerTop}>
      <div id={styles.draggableRegion}></div>
      <div id={styles.headerContent}>
        <div id={styles.leftSide}>
          <h1 id={styles.appTitle}>GreenLight Presentation</h1>
        </div>
        <div id={styles.rightSide}>
          <div id={styles.actionButtons}>
            <div id={styles.minimize} onClick={(): void => {
              ((window as any).ipc)?.send('controller.minimize');
            }}></div>
            <div id={styles.maximize} onClick={(): void => {
              ((window as any).ipc)?.send('controller.maximize');
            }}></div>
            <div id={styles.close} onClick={(): void => {
              ((window as any).ipc)?.send('app.close');
            }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
