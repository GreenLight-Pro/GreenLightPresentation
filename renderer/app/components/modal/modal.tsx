'use client';

import styles from './modal.module.css';
import { useState } from 'react';

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

export default function Modal({ children, submitText, onSubmit, onCancel, cancelable, show, InvertedsubmitCondition }: IModalProps) {
  return (<div id={styles.modalContainer} className={show ? styles.open : ''}>
      <dialog open={show} id={styles.modalItem}>
        {cancelable && <button onClick={() => {onCancel()}} id={styles.closeModalButton}>
          <div id={styles.closePart}></div>
          <div id={styles.closePart}></div>
        </button>}
        {children}
        <form method="dialog" id={styles.inputAreas}>
          {cancelable && <button onClick={() => {onCancel()}} className={styles.modalButton}>Cancel</button>}
          <button onClick={() => {onSubmit()}} className={[styles.modalButton, styles.mainAction].join(' ')} disabled={InvertedsubmitCondition}>{submitText}</button>
        </form>
      </dialog>
  </div>)
}

export function modalBuilder({ submitText, onSubmit, onCancel, cancelable, InvertedsubmitCondition, html }: IModalBuilderProps & { html: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return {
    html: <Modal submitText={submitText} onSubmit={() => {setOpen(false); onSubmit(); }} onCancel={() => {setOpen(false); onCancel ? onCancel() : null}} cancelable={cancelable} show={open} InvertedsubmitCondition={InvertedsubmitCondition}>
      {html}
    </Modal>,
    show: () => setOpen(true),
    hide: () => setOpen(false)
  }
}
