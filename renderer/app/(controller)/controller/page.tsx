'use client';

import { useRouter } from 'next/navigation';
import { modalBuilder } from '../../components/modal/modal';
import ControllerUI from './controllerUI';
import { useEffect, useState } from 'react';
import styles from './controller.module.css';

export default function Controller() {
  const router = useRouter();
  const [screens, setScreens] = useState<any[]>([]);
  const [choosedExibitionScreen, setChoosedExibitionScreen] = useState<string>('');
  const [choosedControllerScreen, setChoosedControllerScreen] = useState<string>('');
  
  // app.getScreens
  useEffect(() => {
    ((window as any).ipc)?.once('app.getScreens.return', (event: any[]) => {
      event = event[0];
      if (!event || !event.length) {
        alert('No screens found!');
        return router.push('/home');
      }

      ((window as any).ipc)?.on('exhibition.start.error', () => {
        alert(`Error starting exhibition screen!`);
        localStorage.removeItem('exibition.selectedScreen');
        localStorage.removeItem('controller.selectedScreen');
        setChoosedControllerScreen('');
        setChoosedExibitionScreen('');
      });

      // check if theres any previous selected screen
      const exhibitionScreen = localStorage.getItem('exibition.selectedScreen');
      const controllerScreen = localStorage.getItem('controller.selectedScreen');
      // if any of those is not null, check if the id is valid with the current screens if not, set to null otherwise set the useStates to true
      if (exhibitionScreen) {
        const exhibitionScreenId = JSON.parse(exhibitionScreen).id;
        if (event.find((screen: any) => screen.id === exhibitionScreenId)) {
          setChoosedExibitionScreen('');
        } else {
          localStorage.removeItem('exibition.selectedScreen');
        }
      }
      if (controllerScreen) {
        const controllerScreenId = JSON.parse(controllerScreen).id;
        if (event.find((screen: any) => screen.id === controllerScreenId)) {
          setChoosedControllerScreen('');
        } else {
          localStorage.removeItem('controller.selectedScreen');
        }
      }

      setScreens(event);
      if (event.length < 2) {
        ((window as any).ipc)?.send('exhibition.start', event[0].id);
      }
    });
    
    ((window as any).ipc)?.send('app.getScreens');

  }, []);

  // app.getScreens.return
  const chooseExibitionScreen = modalBuilder(
    (
      <div className={[styles.screenList, screens.length < 2 ? styles.notLoaded : ''].join(' ')}>
        <h1>Choose a screen for exibition:</h1>
        {screens.map((screen: any, index: number) => (
          <div key={index} className={styles.screenItem} onClick={() => {
            // store selected id on local storage
            localStorage.setItem('exibition.selectedScreen', JSON.stringify(screen));
          }}>
            <div className={styles.screenTitle}>{screen.name}</div>
            <div className={styles.screenSize}>{screen.size.width}x{screen.size.height}</div>
          </div>
        ))}
      </div>
    ),
    'Confirm',
    () => { setChoosedExibitionScreen(JSON.parse(localStorage.getItem('exibition.selectedScreen')).id); },
    () => { router.push('/home'); },
    true,
    (() => {
      // const localStorage = (window as any)?.localStorage;
      // const screen = localStorage?.getItem('exibition.selectedScreen');
      // if (!screen) {
      //   return true;
      // }
      return false;
    })()
  );

  const chooseControllerScreen = modalBuilder(
    (
      <div className={[styles.screenList, screens.length < 2 ? styles.notLoaded : ''].join(' ')}>
        <h1>Choose a screen for controlling:</h1>
        {screens.map((screen: any, index: number) => (
          <div key={index} className={styles.screenItem} onClick={() => {
            // store selected id on local storage
            localStorage.setItem('controller.selectedScreen', JSON.stringify(screen));
          }}>
            <div className={styles.screenTitle}>{screen.name}</div>
            <div className={styles.screenSize}>{screen.size.width}x{screen.size.height}</div>
          </div>
        ))}
      </div>
    ),
    'Confirm',
    () => { setChoosedControllerScreen(JSON.parse(localStorage.getItem('controller.selectedScreen')).id); },
    () => { router.push('/home'); },
    true,
    (() => {
      // const localStorage = (window as any)?.localStorage;
      // const select = localStorage.getItem('controller.selectedScreen');
      // if (!select) {
      //   return true;
      // }
      return false;
    })()
  );

  // triggered when screens are choosed
  useEffect(() => {
    if (choosedExibitionScreen && choosedControllerScreen) {
      // exhibition.start (screenId)
      const screen = localStorage.getItem('exibition.selectedScreen');
      if (!screen) {
        setChoosedControllerScreen('');
        return setChoosedExibitionScreen('');
      }
      ((window as any).ipc)?.send('exhibition.start', JSON.parse(screen).id);
    } else if (choosedExibitionScreen) {
      chooseControllerScreen.show();
    } else {
      chooseExibitionScreen.show();
    }
  }, [choosedExibitionScreen, choosedControllerScreen]);
  
  return screens.length < 2 || (choosedExibitionScreen && choosedControllerScreen) ? <ControllerUI /> : <div id={styles.modalsScreen}>
      {chooseControllerScreen.html}
      {chooseExibitionScreen.html}
    </div>;
}