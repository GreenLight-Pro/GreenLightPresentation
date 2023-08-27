import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { IPageProps } from '../interfaces';

function Home({ props }: { props: IPageProps }): React.JSX.Element {
  useEffect(() => {
    props.title.set('Home');
  }, []);

  return (
    <>
      <div>
        <button onClick={(): void => {
          if (props.backend.connected) {
            props.backend.ipc.current.send('exibition.start');
          }
        }}>Open Exibition Panel</button>
        <button onClick={(): void => {
          if (props.backend.connected) {
            props.backend.ipc.current.send('exibition.stop');
          }
        }}>Close Exibition Panel</button>
        <Link href="/next">
          <Image src="/images/logo.png" alt='Meu texto' width={80} height={80} />
        </Link>
      </div>
    </>
  );
}

export default Home;
