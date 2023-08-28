import React, { useEffect, JSX } from 'react';
import Link from 'next/link';
import { IPageProps } from '../interfaces';

function Next({ props }: { props: IPageProps }): JSX.Element {
  useEffect(() => {
    props.title.set('Next');
  }, []);

  return (
    <React.Fragment>
      <div>
        <p>
                    ⚡ Electron + Next.js ⚡ -
          <Link href="/home">
            Go to home page
          </Link>
        </p>
      </div>
    </React.Fragment>
  );
}

export default Next;
