'use client';

import { useEffect, useState } from "react";
import { modalBuilder } from "../../components/modal/modal";
import styles from './controller.module.css';
import { useRouter } from "next/navigation";

export default function Controller() {
  const router = useRouter();
  const closeModal = modalBuilder(
    (<h1>Do you really wanna exit the app? (Any unsaved progress will be lost!)</h1>),
    'Yes',
    () => { ((window as any).ipc)?.send('app.stop.answer', true); },
    () => { ((window as any).ipc)?.send('app.stop.answer', false); },
    true
  );

  const stopPresentingModal = modalBuilder(
    (<h1>Do you really wanna exit the app? (Any unsaved progress will be lost!)</h1>),
    'Yes',
    () => { ((window as any).ipc)?.send('exhibition.stop'); },
    () => {},
    true
  );

  useEffect(() => {
    ((window as any).ipc)?.send('exhibition.start');

    ((window as any).ipc)?.on('app.stop.ask', () => {
      stopPresentingModal.hide();
      closeModal.show();
    });

    return () => {
      ((window as any).ipc)?.send('exhibition.stop');
    }
  }, []);

  return (<div id={styles.controllerPage}>
    {stopPresentingModal.html}
    {closeModal.html}
    <h1>I'm the controller! Fear me!</h1>
    <button onClick={() => stopPresentingModal.show()}>Let me OUT!</button>
    <button onClick={() => { ((window as any).ipc)?.send('exhibition.start'); }}>Let me IN!</button>
  </div>)
}