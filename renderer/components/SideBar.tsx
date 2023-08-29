import { IPageProps } from '../interfaces';
import { JSX } from 'react';

import styles from '../styles/components/sidebar.module.css';

export function SideBar({ props }: { props: IPageProps }): JSX.Element {
  return (<div id={styles.sidebar} className={[props.sidebar.open ? styles.expanded : ''].join(' ')}>
    <div id={styles.expandButtonContainer}>
      <div id={styles.expandButtonHelper}></div>
      <div id={styles.expandButton} onClick={():void => { props.sidebar.setOpen(!props.sidebar.open); }}>
        <div className={styles.expandButtonIcon}></div>
        <div className={styles.expandButtonIcon}></div>
        <div className={styles.expandButtonIcon}></div>
      </div>
    </div>
  </div>);
}
