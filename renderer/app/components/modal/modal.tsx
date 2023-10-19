'use client';

import styles from './modal.module.css';
import { useState } from 'react';

export default function Modal({ children, submitText, onSubmit, onCancel, cancelable, show }: { children: React.ReactNode, submitText: string, onSubmit: () => void, onCancel: () => void, cancelable?: boolean, show?: boolean }) {
  return (<div id={styles.modalContainer} className={show ? styles.open : ''}>
      <dialog open={show} id={styles.modalItem}>
        <button onClick={() => {onCancel()}} id={styles.closeModalButton}>
          <div id={styles.closePart}></div>
          <div id={styles.closePart}></div>
        </button>
        {children}
        <form method="dialog" id={styles.inputAreas}>
          {cancelable && <button onClick={() => {onCancel()}} className={styles.modalButton}>Cancel</button>}
          <button onClick={() => {onSubmit()}} className={[styles.modalButton, styles.mainAction].join(' ')}>{submitText}</button>
        </form>
      </dialog>
  </div>)
}

export function modalBuilder(children: React.ReactNode, submitText: string, onSubmit: () => void, onCancel: () => void, cancelable?: boolean) {
  const [open, setOpen] = useState(false);
  return {
    html: <Modal submitText={submitText} onSubmit={() => {setOpen(false); onSubmit()}} onCancel={() => {setOpen(false); onCancel()}} cancelable={cancelable} show={open}>
      {children}
    </Modal>,
    show: () => setOpen(true),
    hide: () => setOpen(false)
  }
}