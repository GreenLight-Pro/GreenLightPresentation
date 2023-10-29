'use client';

import React, { useState } from 'react';
import styles from './modal.module.css';

export interface IModalBuilderProps {
  submitText: string,
  onSubmit: () => void,
  onCancel?: () => void,
  cancelable?: boolean,
  InvertedsubmitCondition?: boolean,
}

export interface IModalProps extends IModalBuilderProps {
  children: React.ReactNode,
  show?: boolean,
}

export default function Modal({ children, submitText, onSubmit, onCancel, cancelable, show, InvertedsubmitCondition }: IModalProps): React.ReactElement {
  return (<div id={styles.modalContainer} className={show ? styles.open : ''}>
    <dialog open={show} id={styles.modalItem}>
      {cancelable && <button onClick={(): void => { onCancel(); }} id={styles.closeModalButton}>
        <div id={styles.closePart}></div>
        <div id={styles.closePart}></div>
      </button>}
      {children}
      <form method="dialog" id={styles.inputAreas}>
        {cancelable && <button onClick={ (): void => { onCancel(); }} className={styles.modalButton}>Cancel</button>}
        <button onClick={ (): void => { onSubmit(); }} className={[styles.modalButton, styles.mainAction].join(' ')} disabled={InvertedsubmitCondition}>{submitText}</button>
      </form>
    </dialog>
  </div>);
}

export function modalBuilder({ submitText, onSubmit, onCancel, cancelable, InvertedsubmitCondition, html }: IModalBuilderProps & { html: React.ReactElement }): { html: React.ReactElement, show: () => void, hide: () => void } {
  const [open, setOpen] = useState(false);
  return {
    html: <Modal
      submitText={submitText}
      onSubmit={(): void => { setOpen(false); onSubmit(); }}
      onCancel={(): void => { setOpen(false); if (onCancel) onCancel(); }}
      cancelable={cancelable}
      show={open}
      InvertedsubmitCondition={InvertedsubmitCondition}
    >
      {html}
    </Modal>,
    show: (): void => setOpen(true),
    hide: (): void => setOpen(false),
  };
}
