import type { IPageProps } from '../interfaces';
import { JSX, useRef, useState } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import electron from 'electron';

import '../styles/globals.css';

const ipcRenderer = electron.ipcRenderer || false;

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const [title, setTitle] = useState<string>('');
  const hasIpc = !!ipcRenderer;
  const ipc = useRef(ipcRenderer);

  const updatedPageProps: IPageProps = {
    ...pageProps,
    title: {
      current: title,
      set: (value: string, raw = false): void => { setTitle(`${raw ? '' : 'Controller - '}${value}`); },
    },
    backend: {
      connected: hasIpc,
      ipc,
    },
  };

  return (<div>
    <Head>
      <title>{title}</title>
    </Head>
    <Component props={updatedPageProps} />
  </div>);
}
