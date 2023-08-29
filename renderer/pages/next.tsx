import React, { useEffect, JSX } from 'react';
import Link from 'next/link';
import { IPageProps } from '../interfaces';

function Next({ props }: { props: IPageProps }): JSX.Element {
  useEffect(() => {
    props.title.set('Next');
    props.app.setLoadingProgress(1);
    props.page.setLoadingProgress(1);
  }, []);

  return (
    <React.Fragment>
      <div>
        <p>
                    ⚡ Electron + Next.js ⚡ -
          <Link href="/home" onClick={(): void => {
            props.page.setLoadingProgress(0);
          }}>
            Go to home page
          </Link>
        </p>
      </div>
    </React.Fragment>
  );
}

export default Next;
