import React, { useEffect, JSX } from 'react';

import styles from '../styles/exibition.module.css';
import { IPageProps } from '../interfaces';

export default function Exibition({ props }: { props: IPageProps }): JSX.Element {
  useEffect(() => {
    props.title.set('Exibition');
    props.app.setLoadingProgress(1);
    props.page.setLoadingProgress(1);
  }, []);

  return <div id={styles.fullscreen}>
    <h1>This is the exibition Screen</h1>
  </div>;
}
