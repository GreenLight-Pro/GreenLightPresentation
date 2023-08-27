import React, { useEffect } from 'react';

import styles from '../styles/exibition.module.css';
import { IPageProps } from '../interfaces';

export default function Exibition({ props }: { props: IPageProps }): React.JSX.Element {
  useEffect(() => {
    props.title.set('Exibition', true);
  }, []);

  return <div id={styles.fullscreen}>
    <h1>This is the exibition Screen</h1>
  </div>;
}
