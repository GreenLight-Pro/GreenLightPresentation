import styles from '../../styles/components/layout/basePage.module.css';
import { IBasePageProps, QualityLevels } from '../../interfaces';
import { JSX } from 'react';

export function BasePage(props: IBasePageProps): JSX.Element {
  return (<div id={styles.basePage}>
    <div id={styles.backgroundEffects} className={props.styles.qualityLevel.current === QualityLevels.high ? styles.highQuality : styles.lowQuality}>
      <div className={[styles.sphere, styles.sphereP1].join(' ')}></div>
      <div className={[styles.sphere, styles.sphereP2].join(' ')}></div>
      <div className={[styles.sphere, styles.sphereP3].join(' ')}></div>
      <div className={[styles.sphere, styles.sphereP4].join(' ')}></div>
    </div>
    {props.children}
  </div>);
}
