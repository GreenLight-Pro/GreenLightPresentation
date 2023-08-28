import { ILayoutComponentProps } from './';

export enum boxBrightness {
  bg8 = '--box-8-background-color',
  bg12 = '--box-12-background-color',
  bg16 = '--box-16-background-color'
}

export interface IBoxProps extends ILayoutComponentProps {
  gridContainer?: string;
  id?: string;
  background?: boxBrightness;
}
