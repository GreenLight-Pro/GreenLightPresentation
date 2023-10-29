import React, { useEffect } from 'react';
import { modalBuilder } from '../../components/modal/modal';
import { useRouter } from 'next/navigation';
import styles from './controllerUI.module.css';

export default function ControllerUI(): React.ReactElement {
  const router = useRouter();
  const closeModal = modalBuilder({
    html: (<h1>Do you really wanna exit the app? (Any unsaved progress will be lost!)</h1>),
    submitText: 'Yes',
    onSubmit: () => { ((window as any).ipc)?.send('app.stop.answer', true); },
    cancelable: true,
  });

  const stopPresentingModal = modalBuilder({
    html: (<h1>Do you really wanna exit the presentation? (Any unsaved progress will be lost!)</h1>),
    submitText: 'Yes',
    onSubmit: () => { ((window as any).ipc)?.send('exhibition.stop'); router.push('/home'); return true; },
    cancelable: true,
  });

  useEffect(() => {
    ((window as any).ipc)?.on('app.stop.ask', () => {
      closeModal.show();
    });
  });

  return (<div id={styles.controllerPage}>
    {stopPresentingModal.html}
    {closeModal.html}
    <h1>I'm the controller! Fear me!</h1>
    <button onClick={(): void => stopPresentingModal.show()}>Let me OUT!</button>
    <button onClick={(): void => { ((window as any).ipc)?.send('exhibition.start'); }}>Let me IN!</button>
  </div>);
}
