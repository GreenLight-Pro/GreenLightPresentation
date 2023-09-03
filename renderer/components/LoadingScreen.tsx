import { IPageProps, QualityLevels } from '../interfaces';
import { JSX, useEffect, useState } from 'react';
import Image from 'next/image';

import styles from '../styles/loadingScreen.module.css';

var exitAnimationDuration = 1;

export function LoadingScreen({ props, context }: { props: IPageProps, context: string }): JSX.Element {
  const ctx = context === 'app' ? props.app : props.page;
  if (context !== 'app') exitAnimationDuration = 0.5;
  const [loadedWithAnimation, setLoadedWithAnimation] = useState<boolean>(false);
  const [exitAnimationCompleteness, setExitAnimationCompleteness] = useState<number>(0);
  useEffect(() => {
    var internalExitAnimationCompleteness = 0;
    function internalAnimationHandler(): void {
      if (internalExitAnimationCompleteness >= 2) {
        setLoadedWithAnimation(true);
        setExitAnimationCompleteness(2);
        internalExitAnimationCompleteness = 2;
        if (context === 'app') props.app._setLoadedWithAnimation(true);
      } else {
        internalExitAnimationCompleteness += 1 / ((exitAnimationDuration / 2) * 60);
        setExitAnimationCompleteness(internalExitAnimationCompleteness);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-undef
        requestAnimationFrame(internalAnimationHandler);
      }
    }
    if (context !== 'app' && !props.app.loaded) {
      setLoadedWithAnimation(true);
      setExitAnimationCompleteness(2);
      if (context === 'app') props.app._setLoadedWithAnimation(true);
      internalExitAnimationCompleteness = 2;
    } else {
      if (!ctx.loaded) {
        setLoadedWithAnimation(false);
        setExitAnimationCompleteness(0);
        if (context === 'app') props.app._setLoadedWithAnimation(false);
      }
      if (ctx.loaded && !loadedWithAnimation) {
        if (props.style.qualityLevel.current === QualityLevels.low) {
          setLoadedWithAnimation(true);
          setExitAnimationCompleteness(2);
          if (context === 'app') props.app._setLoadedWithAnimation(true);
        } else {
          setExitAnimationCompleteness(0);
          internalAnimationHandler();
          if (context === 'app') props.app._setLoadedWithAnimation(false);
        }
      }
    }
  }, [ctx.loaded, props.app.loaded]);
  return (<div id={styles.splashScreen} className={loadedWithAnimation ? '' : styles.showSplashScreen} style={{
    ['--loading-progress' as any]: (ctx.loadingProgress * 100) + '%',
    ['--exit-animation-progress' as any]: exitAnimationCompleteness,
    ['--progress-complete' as any]: ctx.loadingProgress === 1 ? 1 : 0,
    ['--logo-should-play-animation' as any]: ctx.loadingProgress === 1 ? '0s' : '1s',
  }}>
    <div id={styles.appLogoContainer}>
      <Image src="/images/logo.png" alt='Logo' width={1080} height={1080} loading='eager' id={styles.appLogo}/>
    </div>
    <div id={styles.appNameRevealContainer}>
      <h1 id={styles.appname}>SpinMediaPlayer</h1>
    </div>
    <div id={styles.progressBarContainer}>
      <div id={styles.progressbar}>
        <div id={styles.progressbarFill}></div>
      </div>
    </div>
  </div>);
}
