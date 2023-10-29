'use client';
import { modalBuilder } from '../components/modal/modal';
import { ReactElement, useEffect } from 'react';

export default function CloseAppHandler(): ReactElement {
  const closeModal = modalBuilder({
    html: (
      <center>
        <h1>Você realmente quer fechar o aplicativo?</h1>
        <br/>
        <p>O modo apresentação ainda está ativo, portanto, fechar o aplicativo também encerrará a apresentação!</p>
      </center>
    ),
    submitText: 'Sim',
    submitColor: '#cc3333',
    cancelText: 'Não',
    onSubmit: () => { ((window as any).ipc)?.send('app.stop.answer', true); },
    cancelable: true,
  });

  useEffect(() => {
    ((window as any).ipc)?.on('app.stop.ask', () => {
      closeModal.show();
    });
  });

  return closeModal.html;
}
