import React, { useEffect, JSX } from 'react';

import styles from '../styles/exibition.module.css';
import { IPageProps, QualityLevels } from '../interfaces';

export default function Exibition({ props }: { props: IPageProps }): JSX.Element {
  useEffect(() => {
    props.title.set('Exibition');
    props.app.setLoadingProgress(1);
    props.page.setLoadingProgress(1);
    props.style.qualityLevel.set(QualityLevels.low);
    props.controller.setIsController(false);
  }, []);

  return <div id={styles.fullscreen}>
    <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/EGeV0rJqlCs?si=n7ZM8qknFTiEgk_v&amp;controls=0&autoplay=1&loop=1" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
  </div>;
}
