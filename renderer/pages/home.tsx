import { IPageProps } from '../interfaces';
import React, { useEffect, JSX } from 'react';
import styles from '../styles/home.module.css';
import Image from 'next/image';
import Link from 'next/link';

function Home({ props }: { props: IPageProps }): JSX.Element {
  useEffect(() => {
    props.title.set('Home');
    props.controller.setIsController(true);
    props.page.setLoadingProgress(1);
    props.app.setLoadingProgress(1);
  }, []);

  return (
    <>
      <button onClick={(): void => {
        if (props.backend.connected) {
          props.backend.ipc.current.send('exibition.start');
          props.presenting.set(true);
        }
      }}>Open Exibition Panel</button>
      <button onClick={(): void => {
        if (props.backend.connected) {
          props.backend.ipc.current.send('exibition.stop');
          props.presenting.set(false);
        }
      }}>Close Exibition Panel</button>
      <button onClick={(): void => {
        if (props.player.playing) {
          props.player.stop();
        } else {
          props.player.play('test');
        }
      }}>{props.player.playing ? 'Stop' : 'Start'} Playing</button>
      <Link href="/next">
        <Image src="/images/logo.png" alt='Meu texto' width={80} height={80} />
      </Link>
    </>
  );
}

export default Home;
