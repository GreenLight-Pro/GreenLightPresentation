'use client';

import styles from './header.module.css';
import { useEffect } from 'react';

export default function Header() {
  return (
    <div id={styles.headerTop}>
      <div id={styles.draggableRegion}></div>
      <div id={styles.headerContent}>
        <div id={styles.leftSide}>
          <h1 id={styles.appTitle}>SpinMusicPlayer</h1>
        </div>
        <div id={styles.rightSide}>
          <div id={styles.actionButtons}>
            <div id={styles.minimize} onClick={() => {
              ((window as any).ipc)?.send('controller.minimize');
            }}></div>
            <div id={styles.maximize} onClick={() => {
              ((window as any).ipc)?.send('controller.maximize');
            }}></div>
            <div id={styles.close} onClick={() => {
              ((window as any).ipc)?.send('controller.close');
            }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
