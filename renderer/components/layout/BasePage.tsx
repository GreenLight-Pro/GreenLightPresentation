import styles from '../../styles/components/layout/basePage.module.css';
import { IBasePageProps } from '../../interfaces';
import { JSX, useEffect } from 'react';

export function BasePage(props: IBasePageProps): JSX.Element {
  useEffect(() => {
    props.title.set(props.pageTitle);
    props.controller.setIsController(true);
    props.app.setLoadingProgress(1);
    props.page.setLoadingProgress(props.loadingProgress || 1);
  }, []);

  return (
    <div id={styles.basePage}>
      {props.children}
    </div>);
}
