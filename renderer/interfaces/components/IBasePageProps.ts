import { ReactNode } from 'react';
import { IPageProps } from '..';

export interface IBasePageProps extends IPageProps {
  children: ReactNode;
  pageTitle: string;
  loadingProgress?: number,
}
