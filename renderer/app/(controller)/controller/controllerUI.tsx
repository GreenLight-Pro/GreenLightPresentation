import { useEffect, useState } from "react";
import { modalBuilder } from "../../components/modal/modal";
import { useRouter } from "next/navigation";
import styles from './controllerUI.module.css';

export default function ControllerUI() {
  const router = useRouter();
  const closeModal = modalBuilder(
    (<h1>Do you really wanna exit the app? (Any unsaved progress will be lost!)</h1>),
    'Yes',
    () => { ((window as any).ipc)?.send('app.stop.answer', true); return true; },
    () => { ((window as any).ipc)?.send('app.stop.answer', false); },
    true
  );

  const stopPresentingModal = modalBuilder(
    (<h1>Do you really wanna exit the app? (Any unsaved progress will be lost!)</h1>),
    'Yes',
    () => { ((window as any).ipc)?.send('exhibition.stop'); router.push('/home'); return true;},
    () => {},
    true
  );

  return (<div id={styles.controllerPage}>
    {stopPresentingModal.html}
    {closeModal.html}
    <h1>I'm the controller! Fear me!</h1>
    <button onClick={() => stopPresentingModal.show()}>Let me OUT!</button>
    <button onClick={() => { ((window as any).ipc)?.send('exhibition.start'); }}>Let me IN!</button>
  </div>)
}