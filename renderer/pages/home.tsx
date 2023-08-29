import { IPageProps, QualityLevels, Themes } from '../interfaces';
import React, { useEffect, JSX } from 'react';
import styles from '../styles/home.module.css';
import Image from 'next/image';
import Link from 'next/link';

function Home({ props }: { props: IPageProps }): JSX.Element {
  useEffect(() => {
    props.title.set('Home');
    props.controller.setIsController(true);
    props.app.setLoadingProgress(1);
    props.page.setLoadingProgress(1);
  }, []);

  return (
    <>
      <button onClick={(): void => {
        if (props.backend.connected) {
          props.backend.ipc.current.send('exibition.start');
          props.presenting.set(true);
        }
      }}>Open Exibition Panel</button>
      <button onClick={(): void => {
        if (props.backend.connected) {
          props.backend.ipc.current.send('exibition.stop');
          props.presenting.set(false);
        }
      }}>Close Exibition Panel</button>
      <button onClick={(): void => {
        if (props.player.playing) {
          props.player.stop();
        } else {
          props.player.play('test');
        }
      }}>{props.player.playing ? 'Stop' : 'Start'} Playing</button>
      <button onClick={(): void => {
        props.sidebar.setOpen(!props.sidebar.open);
      }}>{props.sidebar.open ? 'close' : 'open'} sidebar</button>

      <button onClick={(): void => {
        if (props.style.theme.current === Themes.Dark) {
          props.style.theme.set(Themes.Light);
        } else {
          props.style.theme.set(Themes.Dark);
        }
      }}>{props.style.theme.current} theme</button>
      <button onClick={(): void => {
        if (props.style.qualityLevel.current === QualityLevels.high) {
          props.style.qualityLevel.set(QualityLevels.low);
        } else {
          props.style.qualityLevel.set(QualityLevels.high);
        }
      }}>{props.style.qualityLevel.current} quality</button>
      <button onClick={(): void => {
        props.app.setLoadingProgress(0);
        setTimeout(() => {
          props.app.setLoadingProgress(1);
        }, 5000);
      }}>Debug app SplashScreen</button>
      <button onClick={(): void => {
        props.page.setLoadingProgress(0);
        setTimeout(() => {
          props.page.setLoadingProgress(1);
        }, 5000);
      }}>Debug page SplashScreen</button>
      <Link href="/next" onClick={(): void => {
        props.page.setLoadingProgress(0);
      }}>
        <Image src="/images/logo.png" alt='Logo' width={100} height={100} />
      </Link>
    </>
  );
}

export default Home;
