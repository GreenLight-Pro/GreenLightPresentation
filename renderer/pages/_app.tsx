import { IPageProps, Themes, boxBrightness, IMainLayoutProps } from '../interfaces';
import React, { JSX, useEffect, useRef, useState, cloneElement, ReactElement, DragEvent } from 'react';
import { BasePage, Box } from '../components';
import type { AppProps } from 'next/app';
import electron from 'electron';
import Head from 'next/head';

import controllerStyles from '../styles/controller.module.css';
import splashScreenStyles from '../styles/splashScreen.module.css';
import '../styles/globals.css';

function Main({ data, children }: IMainLayoutProps): JSX.Element {
  const props = data;
  useEffect(() => {
    props.title.set('Home');
    if (window) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <BasePage>
      <div id={controllerStyles.mainGrid} className={[props.player.playing ? controllerStyles.playing : ''].join(' ')} style={{
        ['--playing-media' as any]: props.player.playing ? '1' : '0',
      }}>
        <Box gridContainer='header' id={controllerStyles.header} background={boxBrightness.bg16}>
          <h1 id={controllerStyles.appTitle}>{props.title.current}</h1>
          <div id={controllerStyles.appControls}>
            <div id={controllerStyles.appControlMinimize} className={controllerStyles.appControl} onClick={():void => { props.backend.ipc.current.send('controller.minimize'); }}></div>
            <div id={controllerStyles.appControlMaximize} className={controllerStyles.appControl} onClick={():void => { props.backend.ipc.current.send('controller.maximize'); }}></div>
            <div id={controllerStyles.appControlClose} className={controllerStyles.appControl} onClick={():void => { props.backend.ipc.current.send('controller.close'); }}></div>
          </div>
          <div id={controllerStyles.dragwindow}></div>
        </Box>
        <Box gridContainer='sidebar' background={boxBrightness.bg12}>

        </Box>
        <Box gridContainer='main'>
          {cloneElement(children[0] as ReactElement<IPageProps>, data) }
          {cloneElement(children[1] as ReactElement<IPageProps>, data) }
        </Box>
        <Box id={controllerStyles.player} gridContainer='media' background={boxBrightness.bg16}>

        </Box>
      </div>
    </BasePage>
  );
}

const ipcRenderer = electron.ipcRenderer || false;

function generateTitle(title: string, isPresenting: boolean): string {
  return `SpinMediaPlayer - ${isPresenting ? 'presenting - ' : ''}${title}`;
}

function preventDragHandler(e: DragEvent): void {
  e.preventDefault();
}

function SplashScreen({ props, context }: { props: IPageProps, context: string }): JSX.Element {
  return (<div id={splashScreenStyles.splashScreen} className={(context === 'app' ? props.app.loaded : props.page.loaded) ? '' : splashScreenStyles.showSplashScreen} style={{
    ['--loading-progress' as any]: ((context === 'app' ? props.app.loadingProgress : props.page.loadingProgress) * 100) + '%',
  }}>
    <div id={splashScreenStyles.progressbar}>
      <div id={splashScreenStyles.progressbarFill}></div>
    </div>
  </div>);
}

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const [isController, setIsController] = useState<boolean>(false);
  const [appLoadProgress, setAppLoadProgress] = useState<number>(0);
  const [pageLoadProgress, setPageLoadProgress] = useState<number>(0);

  const [title, setTitle] = useState<string>('');
  const [isPresenting, setIsPresenting] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [theme, setTheme] = useState<Themes>(Themes.Dark);
  const hasIpc = !!ipcRenderer;
  const ipc = useRef(ipcRenderer);

  if (hasIpc && ipcRenderer) {
    ipcRenderer.on('app.stop.ask', () => {
      ipcRenderer.send('app.stop.answer', true);
    });
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
    theme: {
      current: theme,
      set: (value: Themes): void => { setTheme(value); },
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
      loaded: appLoadProgress >= 1,
      loadingProgress: appLoadProgress,
      setLoadingProgress: (value: number): void => { setAppLoadProgress(value); },
    },
    page: {
      loaded: pageLoadProgress >= 1,
      loadingProgress: pageLoadProgress,
      setLoadingProgress: (value: number): void => { setPageLoadProgress(value); },
    },
  };

  return (
    <div id="mainApplication" className={theme} unselectable='on' onDragStart={preventDragHandler} onSelect={(): boolean => { return false; }}>
      <Head>
        <title>{generateTitle(title, isPresenting)}</title>
      </Head>
      <SplashScreen props={updatedPageProps} context={'app'}/>
      {isController
        ? <Main data={updatedPageProps}>
          <SplashScreen props={updatedPageProps} context={'page'}/>
          <Component props={updatedPageProps} />
        </Main>
        : <Component props={updatedPageProps} />
      }
    </div>
  );
}
