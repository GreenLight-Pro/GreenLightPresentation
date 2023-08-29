import type { AppInitialProps } from 'next/app';

export enum Themes {
  Dark = 'dark',
  Light = 'light',
}

export enum QualityLevels {
  low = 'lowQuality', // Remove all expensive effects like blur
  high = 'highQuality', // Add all expensive effects like blur
}

export interface IStylesProps {
  theme: {
    current: string,
    set: (theme: Themes) => void,
  },
  qualityLevel: {
    current: QualityLevels,
    set: (qualityLevel: QualityLevels) => void,
  },
}

export interface IPageProps extends AppInitialProps {
  title: {
    current: string,
    set: (title: string, raw?: boolean) => void,
  },
  backend: {
    ipc: any;
    connected: boolean;
  },
  style: IStylesProps,
  presenting: {
    current: boolean,
    set: (presenting: boolean) => void,
  },
  player: {
    playing: boolean,
    play: (name: string) => void,
    stop: () => void,
  },
  controller: {
    isController: boolean,
    setIsController: (isController: boolean) => void,
  },
  app: {
    loaded: boolean,
    loadingProgress: number,
    setLoadingProgress: (loadingProgress: number) => void,
  },
  page: {
    loaded: boolean,
    loadingProgress: number,
    setLoadingProgress: (loadingProgress: number) => void,
  },
  sidebar: {
    open: boolean,
    setOpen: (open: boolean) => void,
  }
}
