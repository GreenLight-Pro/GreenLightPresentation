import { IBoxProps } from '../../interfaces';
import { JSX } from 'react';

import styles from '../../styles/components/layout/box.module.css';

export function Box(props: IBoxProps): JSX.Element {
  return (<div id={props.id} className={[styles.box, styles[props.style.qualityLevel.current]].join(' ')} style={{
    gridArea: props.gridContainer,
    background: `var(${props.background})`,
  }}>
    {props.children}
  </div>);
}
