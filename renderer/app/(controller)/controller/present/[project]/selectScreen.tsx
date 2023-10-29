'use client';

import selectionModal, { ISelectElement } from '../../../../components/selectionModal/selectionModal';
import { modalBuilder } from '../../../../components/modal/modal';
import React, { useEffect, useState } from 'react';
import styles from './selectScreen.module.css';
import { useRouter } from 'next/navigation';

interface IScreen {
  id: number,
  name: string,
  size: {
    width: number,
    height: number
  }
}

export default function Controller({ children }: { children: React.ReactElement }): React.ReactElement {
  const router = useRouter();
  const [selectedExhibition, setSelectedExhibition] = useState<any>({});
  const [selectedController, setSelectedController] = useState<any>({});
  const [isPresenting, setIsPresenting] = useState<boolean>(false);
  const [screens, setScreens] = useState<IScreen[]>([]);

  const closeModal = modalBuilder({
    html: (
      <center>
        <h1>Você realmente quer parar a apresentação?</h1>
        <br/>
        <p>O modo apresentação ainda está ativo, isso encerrará a apresentação!</p>
      </center>
    ),
    submitText: 'Sim',
    submitColor: '#cc3333',
    cancelText: 'Não',
    onSubmit: () => {
      setIsPresenting(false);
      ((window as any).ipc)?.send('exhibition.stop');
    },
    cancelable: true,
  });

  function startPresentation(): void {
    const ipc = (window as any)?.ipc;
    setIsPresenting(true);
    if (screens.length === 1) return ipc.send('exhibition.start', selectedExhibition.id);
    ipc.send('controller.move', selectedController.id);
    ipc.send('exhibition.start', selectedExhibition.id);
  }

  function stopPresentation(extraCallBack?: () => void): void {
    closeModal.show(extraCallBack);
  }

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
      setSelectedController(selectedScreen);
    },
  });

  const chooseExhibitionScreen = selectionModal({
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
      setSelectedController(screens.find((item) => item.id !== selectedScreen.id));
    },
  });

  // app.getScreens
  useEffect(() => {
    const ipc = (window as any)?.ipc;
    const alert = (window as any)?.alert;

    ipc?.once('app.getScreens.return', ([data]: any[]) => {
      if (!data || !data.length) return router.push('/home');

      ipc?.on('exhibition.start.error', () => alert(`Error starting exhibition screen!`));

      setScreens(data);
      if (!selectedExhibition.id) chooseExhibitionScreen.show();
    });

    ipc?.send('app.getScreens');
  }, []);

  return <div id={styles.selectScreen}>
    {children}
    {closeModal.html}
    {(screens.length > 1 && !(selectedController.id && selectedExhibition.id)) &&
      <>
        {chooseControllerScreen.html}
        {chooseExhibitionScreen.html}
      </>
    }
    <div id={styles.controlBar}>
      <div id={styles.left}>
        <button className={styles.controlButton} onClick={(): void => {
          // clear the store of the modals
          const exhibitionStore = (window as any)?.store?.createStore({
            name: 'exhibitionScreen',
          });
          const controllerStore = (window as any)?.store?.createStore({
            name: 'controllerScreen',
          });
          exhibitionStore.clear();
          controllerStore.clear();

          setSelectedExhibition({});
          setSelectedController({});
          chooseExhibitionScreen.show();
        }}>Alterar a tela de apresentação</button>
      </div>
      <div id={styles.right}>
        <button className={styles.controlButton} onClick={(): void => {
          if (isPresenting) return stopPresentation(() => { router.push('/home'); });
          router.push('/home');
        }}>Fechar projeto</button>
        <button className={styles.controlButton} onClick={(): void =>
          isPresenting ? stopPresentation() : startPresentation()
        }>{isPresenting ? 'Parar Apresentação' : 'Iníciar apresentação'}</button>
      </div>
    </div>
  </div>;
}
