import type { AppInitialProps } from 'next/app';

export interface IPageProps extends AppInitialProps {
  title: {
    current: string,
    set: (title: string, raw?: boolean) => void,
  },
  backend: {
    ipc: any;
    connected: boolean;
  },
}
