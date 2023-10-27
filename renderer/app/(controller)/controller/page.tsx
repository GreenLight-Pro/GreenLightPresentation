'use client';

import selectionModal, { ISelectElement } from '../../components/selectionModal/selectionModal';
import styles from './controller.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ControllerUI from './controllerUI';

interface IScreen {
  id: number,
  name: string,
  size: {
    width: number,
    height: number
  }
}

export default function Controller() {
  const router = useRouter();
  const [screens, setScreens] = useState<IScreen[]>([]);
  const [selected, setSelected] = useState<boolean>(false);
  const [selectedExhibition, setSelectedExhibition] = useState<any>({});

  // app.getScreens.return

  const chooseControllerScreen = selectionModal({
    items: screens.filter((item) => item.id !== selectedExhibition.id).map((item) => {
      return {
        id: item.id,
        title: item.name,
        description: `${item.size.width}x${item.size.height}`
      }
    }) as unknown as ISelectElement[],
    prompt: 'Selecione uma Tela de Controle',
    storageKey: 'controllerScreen',
    cancelable: false,
    callback: (selectedScreen) => {
      setSelected(true);
      ((window as any).ipc)?.send('controller.move', selectedScreen.id);
      ((window as any).ipc)?.send('exhibition.start', selectedExhibition.id);
    },
  });

  const chooseExibitionScreen = selectionModal({
    items: screens.map((item) => {
      return {
        id: item.id,
        title: item.name,
        description: `${item.size.width}x${item.size.height}`
      }
    }) as unknown as ISelectElement[],
    prompt: 'Selecione uma Tela de Exibição',
    storageKey: 'exhibitionScreen',
    cancelable: false,
    callback: (selectedScreen) => {
      setSelectedExhibition(selectedScreen);
      if (screens.length === 2) {
        setSelected(true);
        const otherScreen = screens.filter((item) => item.id !== selectedScreen.id)[0];
        ((window as any).ipc)?.send('controller.move', otherScreen.id);
        ((window as any).ipc)?.send('exhibition.start', selectedScreen.id);
      }
      else chooseControllerScreen.show();
    },
  });

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
      });

      setScreens(event);
      if (event.length < 2) {
        ((window as any).ipc)?.send('exhibition.start', event[0].id);
      } else if (!selectedExhibition) {
        chooseExibitionScreen.show();
      }
    });
    
    ((window as any).ipc)?.send('app.getScreens');
  }, []);

  return screens.length < 2 || selected ? <ControllerUI /> : <div id={styles.modalsScreen}>
      {chooseControllerScreen.html}
      {chooseExibitionScreen.html}
    </div>;
}