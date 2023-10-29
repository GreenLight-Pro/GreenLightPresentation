'use client';

import selectionModal, { ISelectElement } from '../../components/selectionModal/selectionModal';
import React, { useEffect, useState } from 'react';
import styles from './controller.module.css';
import { redirect } from 'next/navigation';
import ControllerUI from './controllerUI';

interface IScreen {
  id: number,
  name: string,
  size: {
    width: number,
    height: number
  }
}

export default function Controller(): React.ReactElement {
  const [selectedExhibition, setSelectedExhibition] = useState<any>({});
  const [selected, setSelected] = useState<boolean>(false);
  const [screens, setScreens] = useState<IScreen[]>([]);

  // app.getScreens.return

  const chooseControllerScreen = selectionModal({
    items: screens.filter((item) => item.id !== selectedExhibition.id).map((item) => ({
      id: item.id,
      title: item.name,
      description: `${item.size.width}x${item.size.height}`,
    })) as ISelectElement[],
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
    items: screens.map((item) => ({
      id: item.id,
      title: item.name,
      description: `${item.size.width}x${item.size.height}`,
    })) as ISelectElement[],
    prompt: 'Selecione uma Tela de Exibição',
    storageKey: 'exhibitionScreen',
    cancelable: false,
    callback: (selectedScreen) => {
      setSelectedExhibition(selectedScreen);
      if (screens.length !== 2) return chooseControllerScreen.show();

      ((window as any).ipc)?.send('controller.move', screens.filter((item) => item.id !== selectedScreen.id)[0].id);
      ((window as any).ipc)?.send('exhibition.start', selectedScreen.id);
      setSelected(true);
    },
  });

  // app.getScreens
  useEffect(() => {
    const ipc = (window as any)?.ipc;
    const alert = (window as any)?.alert;

    ipc?.once('app.getScreens.return', ([data]: any[]) => {
      if (!data || !data.length) return redirect('/home');

      ipc?.on('exhibition.start.error', () => alert(`Error starting exhibition screen!`));

      setScreens(data);
      if (data.length < 2) ipc?.send('exhibition.start', data[0].id);
      else if (!selectedExhibition) chooseExibitionScreen.show();
    });

    ipc?.send('app.getScreens');
  }, []);

  return screens.length < 2 || selected
    ? <ControllerUI />
    : <div id={styles.modalsScreen}>
      {chooseControllerScreen.html}
      {chooseExibitionScreen.html}
    </div>;
}
