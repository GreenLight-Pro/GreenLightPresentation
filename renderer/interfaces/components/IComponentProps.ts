import { ReactNode } from 'react';
import { IStylesProps } from '../IPageProps';

export interface IComponentProps {

}

export interface ILayoutComponentProps extends IComponentProps {
  children: ReactNode;
  style: IStylesProps;
}
