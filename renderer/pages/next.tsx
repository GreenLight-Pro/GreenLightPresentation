import React, { JSX } from 'react';
import Link from 'next/link';
import { IPageProps } from '../interfaces';
import { BasePage } from '../components';

export default function Next({ props }: { props: IPageProps }): JSX.Element {
  return (
    <BasePage {...props} pageTitle='Next'>
      <Link href="/home" onClick={(): void => { props.page.setLoadingProgress(0); }}>
        Go to home page
      </Link>
    </BasePage>
  );
}
