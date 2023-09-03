import { IPageProps, Themes, boxBrightness, IMainLayoutProps, QualityLevels } from '../interfaces';
import React, { JSX, useEffect, useRef, useState, cloneElement, ReactElement, DragEvent } from 'react';
import { Box, LoadingScreen, SideBar } from '../components';
import type { AppProps } from 'next/app';
import electron from 'electron';
import Image from 'next/image';
import Head from 'next/head';

import styles from '../styles/controller.module.css';
import '../styles/globals.css';

function Main({ data, children }: IMainLayoutProps): JSX.Element {
  const props = data;

  useEffect(() => {
    if (window) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div id={styles.basePage}>
      <div id={styles.backgroundEffects} className={styles[props.style.qualityLevel.current]}>
        <Image src='/images/AppBackground.svg' alt='' width={1080} height={1080} id={styles.backgroundImage}/>
      </div>
      <div id={styles.mainGrid} className={[props.player.playing ? styles.playing : '', props.app.loaded ? '' : styles.hide].join(' ')} style={{
        ['--playing-media' as any]: props.player.playing ? '1' : '0',
        ['--side-bar-size' as any]: props.sidebar.open ? 'var(--expanded-side-bar-size)' : 'var(--shrinked-side-bar-size)',
      }}>
        <Box gridContainer='header' id={styles.header} background={boxBrightness.bg16} style={props.style}>
          <div id={styles.dragwindow}></div>
          <h1 id={styles.appTitle}>{props.title.current}</h1>
        </Box>
        <div id={styles.mainAreaItems}>
          <Box gridContainer='sidebar' id={styles.sidebar} background={boxBrightness.bg12} style={props.style}>
            <SideBar props={props} />
          </Box>
          <Box gridContainer='main' style={props.style}>
            <div className={props.app.loaded ? '' : styles.hide}>
              <div className={props.app._loadedWithAnimation ? '' : styles.hide}>
                {cloneElement(children[0] as ReactElement<IPageProps>, data) }
              </div>
              {cloneElement(children[1] as ReactElement<IPageProps>, data) }
            </div>
          </Box>
        </div>
        <Box id={styles.player} gridContainer='media' background={boxBrightness.bg16} style={props.style}>

        </Box>
      </div>
    </div>
  );
}

const ipcRenderer = electron.ipcRenderer || false;

function generateTitle(title: string, isPresenting: boolean): string {
  return `SpinMediaPlayer - ${isPresenting ? 'presenting - ' : ''}${title}`;
}

function preventDragHandler(e: DragEvent): void {
  e.preventDefault();
}

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const [isController, setIsController] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [appLoadProgress, setAppLoadProgress] = useState<number>(0);
  const [_loadedWithAnimation, _setLoadedWithAnimation] = useState<boolean>(false);
  const [pageLoadProgress, setPageLoadProgress] = useState<number>(0);
  const [isSideBarExpandend, setIsSideBarExpandend] = useState<boolean>(false);

  const [title, setTitle] = useState<string>('');
  const [isPresenting, setIsPresenting] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [theme, setTheme] = useState<Themes>(Themes.Dark);
  const [qualityLevel, setQualityLevel] = useState<QualityLevels>(QualityLevels.high);
  const hasIpc = !!ipcRenderer;
  const ipc = useRef(ipcRenderer);

  if (hasIpc) {
    ipcRenderer.removeAllListeners('app.stop.ask');
    ipcRenderer.removeAllListeners('exibition.maximize.done.maximized');
    ipcRenderer.removeAllListeners('exibition.maximize.done.unmaximized');

    ipcRenderer.on('app.stop.ask', () => {
      ipcRenderer.send('app.stop.answer', true);
    });

    ipcRenderer.on('exibition.maximize.done.maximized', () => { setIsMaximized(true); });
    ipcRenderer.on('exibition.maximize.done.unmaximized', () => { setIsMaximized(false); });
    ipcRenderer.on('window.state.blur', () => { setIsFocused(false); });
    ipcRenderer.on('window.state.focus', () => { setIsFocused(true); });
  }

  const updatedPageProps: IPageProps = {
    ...pageProps,
    title: {
      current: generateTitle(title, isPresenting),
      set: (value: string): void => { setTitle(value); },
    },
    backend: {
      connected: hasIpc,
      ipc,
    },
    style: {
      theme: {
        current: theme,
        set: (value: Themes): void => { setTheme(value); },
      },
      qualityLevel: {
        current: qualityLevel,
        set: (value: QualityLevels): void => { setQualityLevel(value); },
      },
    },
    presenting: {
      current: isPresenting,
      set: (value: boolean): void => { setIsPresenting(value); },
    },
    player: {
      playing: isPlaying,
      play: (): void => { setIsPlaying(true); },
      stop: (): void => { setIsPlaying(false); },
    },
    controller: {
      isController,
      setIsController: (value: boolean) => { setIsController(value); },
    },
    app: {
      _loadedWithAnimation,
      _setLoadedWithAnimation: (value: boolean): void => { _setLoadedWithAnimation(value); },
      loaded: appLoadProgress >= 1,
      loadingProgress: appLoadProgress,
      setLoadingProgress: (value: number): void => { setAppLoadProgress(value); },
      focused: isFocused,
    },
    page: {
      loaded: pageLoadProgress >= 1,
      loadingProgress: pageLoadProgress,
      setLoadingProgress: (value: number): void => { setPageLoadProgress(value); },
    },
    sidebar: {
      open: isSideBarExpandend,
      setOpen: (value: boolean): void => { setIsSideBarExpandend(value); },
    },
  };

  return (
    <div id="mainApplication" className={[theme, qualityLevel, isFocused ? '' : 'unfocused', isPresenting ? 'presenting' : ''].join(' ')} unselectable='on' onDragStart={preventDragHandler} onSelect={(): boolean => { return false; }} style={{
      ['--is-maximized' as any]: isMaximized ? '1' : '0',
    }}>
      <Head>
        <title>{generateTitle(title, isPresenting)}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/images/logo.png" />
      </Head>
      <LoadingScreen props={updatedPageProps} context={'app'}/>
      {isController
        ? <Main data={updatedPageProps}>
          <LoadingScreen props={updatedPageProps} context={'page'}/>
          <Component props={updatedPageProps}/>
        </Main>
        : <Component props={updatedPageProps} />
      }
      {isController
        ? <div id={styles.appControls} className={[styles[qualityLevel], isFocused ? styles.focused : styles.unfocused].join(' ')}>
          <div id={styles.appControlMinimize} className={styles.appControl} onClick={():void => { if (hasIpc) ipcRenderer.send('controller.minimize'); }}></div>
          <div id={styles.appControlMaximize} className={styles.appControl} onClick={():void => { if (hasIpc) ipcRenderer.send('controller.maximize'); }}></div>
          <div id={styles.appControlClose} className={styles.appControl} onClick={():void => { if (hasIpc) ipcRenderer.send('controller.close'); }}></div>
        </div>
        : false}
    </div>
  );
}
